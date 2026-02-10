import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthMutation } from "naystack/graphql/client";
import {
  ChatCircleDots,
  InstagramLogoIcon,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

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
  name,
}: {
  open: boolean;
  close: () => void;
  name: string;
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
      title="We love you ❤️"
      panelClassName="sm:max-w-md"
    >
      <div className="mt-3 space-y-4">
        <p className="text-sm text-gray-600">
          Dear {name.split(" ")[0]},
          <br />
          Thanks a lot for using our app! This means so much to us 🥳
          <br />
          We are currently in <b className="font-semibold">beta</b> and
          improving our app. We need your feedback to make this experience
          better!
        </p>
        <p className="text-sm text-gray-600">
          Oh and also, we only allow{" "}
          <b className="font-semibold">5 messages per user</b> for now. If you
          need more, please let us know :D
        </p>
        <p className="text-sm text-gray-600">
          With love,
          <br />
          Veas team
        </p>
        {!showFeedback && !submitted && (
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowFeedback(true)}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ChatCircleDots size={18} />
              Give Feedback
            </button>
            <a
              href="https://www.instagram.com/veasapp/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramLogoIcon size={18} />
            </a>
          </div>
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
