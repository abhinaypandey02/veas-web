import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import {
  CalendarEvent,
  CalendarEventCategory,
  CalendarForecast,
  loadEvents,
  loadForecasts,
  saveEvents,
  saveForecasts,
} from "../services/calendar";
import { streamChatMessage } from "../services/chat";
import { formatReadableDate } from "../utils/date";

const categoryLabels: Record<CalendarEventCategory, string> = {
  meeting: "Meeting",
  breakup: "Breakup",
  exam: "Exam",
  travel: "Travel",
  milestone: "Emotional milestone",
};

const categoryColors: Record<CalendarEventCategory, string> = {
  meeting: "#998FC7",
  breakup: "#AD7070",
  exam: "#14248A",
  travel: "#B8A06E",
  milestone: "#D4C2FC",
};

export function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState<CalendarEventCategory>("meeting");
  const [forecastLoading, setForecastLoading] = useState(false);

  const queryClient = useQueryClient();
  const { data: events = [] } = useQuery({
    queryKey: ["calendarEvents"],
    queryFn: loadEvents,
  });
  const { data: forecasts = [] } = useQuery({
    queryKey: ["calendarForecasts"],
    queryFn: loadForecasts,
  });

  const saveEventsMutation = useMutation({
    mutationFn: saveEvents,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["calendarEvents"] }),
  });

  const saveForecastsMutation = useMutation({
    mutationFn: saveForecasts,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["calendarForecasts"] }),
  });

  const dayEvents = events.filter((event) => event.date === selectedDate);
  const dayForecast = forecasts.find((forecast) => forecast.date === selectedDate);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    events.forEach((event) => {
      marks[event.date] = marks[event.date] || { marked: true, dots: [] };
      marks[event.date].dots.push({ color: categoryColors[event.category] });
    });
    forecasts.forEach((forecast) => {
      marks[forecast.date] = marks[forecast.date] || { marked: true, dots: [] };
      marks[forecast.date].dots.push({ color: "#14248A" });
    });
    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: "#998FC7",
    };
    return marks;
  }, [events, forecasts, selectedDate]);

  const handleAddEvent = async () => {
    if (!title.trim()) return;
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: title.trim(),
      date: selectedDate,
      category,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    await saveEventsMutation.mutateAsync([newEvent, ...events]);
    setTitle("");
    setNotes("");
    setCategory("meeting");
    setIsModalVisible(false);
  };

  const handleGenerateForecast = async () => {
    if (forecastLoading) return;
    setForecastLoading(true);
    const readableDate = formatReadableDate(new Date(selectedDate));
    const eventsContext = dayEvents
      .map((event) => `${categoryLabels[event.category]}: ${event.title}`)
      .join("; ");

    const prompt = `Give me a short forecast for ${readableDate}. Focus on career, emotions, and relationships. Keep it warm, grounded, and jargon-free.${
      eventsContext ? ` Consider these personal events: ${eventsContext}.` : ""
    }`;

    let text = "";
    try {
      await streamChatMessage(prompt, (chunk) => {
        text = chunk;
      });
      const nextForecasts: CalendarForecast[] = [
        { date: selectedDate, text, createdAt: new Date().toISOString() },
        ...forecasts.filter((forecast) => forecast.date !== selectedDate),
      ];
      await saveForecastsMutation.mutateAsync(nextForecasts);
    } catch (error) {
      const nextForecasts: CalendarForecast[] = [
        {
          date: selectedDate,
          text: "We couldn’t generate a forecast right now. Please try again.",
          createdAt: new Date().toISOString(),
        },
        ...forecasts.filter((forecast) => forecast.date !== selectedDate),
      ];
      await saveForecastsMutation.mutateAsync(nextForecasts);
    } finally {
      setForecastLoading(false);
    }
  };

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-5 pt-6 pb-20 space-y-8">
        <View className="space-y-2">
          <Text className="text-xs uppercase tracking-[0.4em] text-muted">
            Astro calendar
          </Text>
          <Text className="text-3xl font-serif text-foreground">Calendar</Text>
          <Text className="text-sm text-muted">
            Track important days and let Veas connect the dots for you.
          </Text>
        </View>

        <Card className="p-4" variant="solid">
          <Calendar
            markedDates={markedDates}
            markingType="multi-dot"
            onDayPress={(day) => setSelectedDate(day.dateString)}
            theme={{
              backgroundColor: "#FFFFFF",
              calendarBackground: "#FFFFFF",
              dayTextColor: "#1A1A1A",
              textSectionTitleColor: "#706E77",
              monthTextColor: "#1A1A1A",
              arrowColor: "#998FC7",
              todayTextColor: "#14248A",
              selectedDayBackgroundColor: "#998FC7",
              textDayFontFamily: "VeasSans",
              textMonthFontFamily: "VeasSerif",
              textDayHeaderFontFamily: "VeasSans",
            }}
          />
          <View className="mt-4 flex-row flex-wrap gap-3">
            {(Object.keys(categoryLabels) as Array<CalendarEventCategory>).map((key) => (
              <View key={key} className="flex-row items-center gap-2">
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: categoryColors[key],
                  }}
                />
                <Text className="text-[11px] text-muted">{categoryLabels[key]}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View className="space-y-3">
          <Text className="text-lg font-serif text-foreground">
            {formatReadableDate(new Date(selectedDate))}
          </Text>
          {dayForecast ? (
            <View className="bg-surface-highlight rounded-2xl p-4 border border-foreground/5">
              <Text className="text-sm text-foreground leading-relaxed">
                {dayForecast.text}
              </Text>
            </View>
          ) : (
            <Text className="text-sm text-muted">
              No forecast yet. Generate one to capture the day’s energy.
            </Text>
          )}
          <Button
            title={forecastLoading ? "Generating..." : "Generate forecast"}
            onPress={handleGenerateForecast}
            loading={forecastLoading}
          />
        </View>

        <View className="space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-serif text-foreground">Your events</Text>
            <Pressable
              className="px-4 py-2 rounded-full border border-foreground/20 bg-white/80"
              onPress={() => setIsModalVisible(true)}
            >
              <Text className="text-xs uppercase tracking-[0.2em] text-foreground">
                Add
              </Text>
            </Pressable>
          </View>

          {dayEvents.length === 0 ? (
            <Text className="text-sm text-muted">No events on this day.</Text>
          ) : (
            <View className="space-y-2">
              {dayEvents.map((event) => (
                <Card key={event.id} className="space-y-2">
                  <View className="flex-row items-center gap-2">
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: categoryColors[event.category],
                      }}
                    />
                    <Text className="text-sm text-foreground">{event.title}</Text>
                  </View>
                  <Text className="text-xs text-muted">
                    {categoryLabels[event.category]}
                  </Text>
                  {event.notes ? (
                    <Text className="text-xs text-muted">{event.notes}</Text>
                  ) : null}
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-6">
          <Card className="p-6 w-full space-y-4" variant="default">
            <Text className="text-lg font-serif text-foreground">Add event</Text>
            <TextInput
              className="bg-surface-highlight rounded-2xl px-4 py-3 text-foreground"
              placeholder="Event title"
              placeholderTextColor="#9B98A1"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="bg-surface-highlight rounded-2xl px-4 py-3 text-foreground"
              placeholder="Notes (optional)"
              placeholderTextColor="#9B98A1"
              value={notes}
              onChangeText={setNotes}
              multiline
            />

            <View className="space-y-2">
              <Text className="text-xs uppercase tracking-[0.2em] text-muted">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {(
                  Object.keys(categoryLabels) as Array<CalendarEventCategory>
                ).map((key) => (
                  <Pressable
                    key={key}
                    className={`px-3 py-2 rounded-full border ${
                      category === key ? "border-foreground" : "border-foreground/20"
                    }`}
                    onPress={() => setCategory(key)}
                  >
                    <Text className="text-xs text-foreground">{categoryLabels[key]}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 h-12 rounded-full border border-foreground/20 items-center justify-center"
                onPress={() => setIsModalVisible(false)}
              >
                <Text className="text-sm text-foreground">Cancel</Text>
              </Pressable>
              <Pressable
                className="flex-1 h-12 rounded-full bg-foreground items-center justify-center"
                onPress={handleAddEvent}
              >
                <Text className="text-sm text-white">Save</Text>
              </Pressable>
            </View>
          </Card>
        </View>
      </Modal>
    </Screen>
  );
}
