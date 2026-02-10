"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthMutation } from "naystack/graphql/client";
import { ChatCircleDots, PaperPlaneTilt } from "@phosphor-icons/react";

import Modal from "@/components/modal";
import { Button } from "@/components/button";
import Form from "@/components/form";
import Input from "@/components/input/input";
import { SUBMIT_FEEDBACK } from "@/constants/graphql/mutations";

const SATISFACTION_OPTIONS = [
  { label: "1 - Very Unsatisfied", value: "1" },
  { label: "2 - Unsatisfied", value: "2" },
  { label: "3 - Neutral", value: "3" },
  { label: "4 - Satisfied", value: "4" },
  { label: "5 - Very Satisfied", value: "5" },
];

interface FeedbackFormValues {
  score: string;
  text: string;
}

export default function FeedbackModal({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitFeedback, { loading }] = useAuthMutation(SUBMIT_FEEDBACK);

  const form = useForm<FeedbackFormValues>({
    defaultValues: { score: "", text: "" },
  });

  const handleSubmit = async (data: FeedbackFormValues) => {
    try {
      await submitFeedback({
        score: parseInt(data.score),
        text: data.text || undefined,
      });
      setSubmitted(true);
    } catch {
      // silently handle
    }
  };

  const handleClose = () => {
    setShowFeedback(false);
    setSubmitted(false);
    form.reset();
    close();
  };

  return (
    <Modal
      open={open}
      close={handleClose}
      title="Thank You!"
      panelClassName="sm:max-w-md"
    >
      <div className="mt-3 space-y-4">
        <p className="text-sm text-gray-600">
          Thank you for testing our app during beta! We are currently in the
          early stages and only allow <strong>5 messages</strong> for each user.
        </p>
        <p className="text-sm text-gray-600">
          Your patience and feedback mean a lot to us as we continue to improve.
        </p>

        {!showFeedback && !submitted && (
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChatCircleDots size={18} weight="bold" />
            Give Feedback
          </button>
        )}

        {showFeedback && !submitted && (
          <Form form={form} onSubmit={handleSubmit} className="space-y-3">
            <Input
              name="score"
              label="How satisfied are you?"
              placeholder="Select satisfaction level"
              options={SATISFACTION_OPTIONS}
              rules={{ required: true }}
            />
            <Input
              name="text"
              label="Suggestions (optional)"
              placeholder="Any thoughts or suggestions..."
              textarea
            />
            <Button loading={loading} compact className="rounded-lg">
              <PaperPlaneTilt size={16} weight="bold" className="mr-2" />
              Submit Feedback
            </Button>
          </Form>
        )}

        {submitted && (
          <p className="text-sm font-medium text-green-600">
            Thank you for your feedback!
          </p>
        )}
      </div>
    </Modal>
  );
}
