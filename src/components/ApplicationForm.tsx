import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormProgress } from "./FormProgress";
import { FormStep } from "./FormStep";
import {
  applicationSchema,
  ApplicationFormData,
  SUBURBS,
  TIME_IN_AREA,
  PARENT_TYPES,
  CHILD_AGE_RANGES,
} from "@/lib/formSchema";
import { ArrowLeft, ArrowRight, Send, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ApplicationFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const DISCORD_WEBHOOK_URL =
  "https://discordapp.com/api/webhooks/1452827902411538527/Ujtrtj5Iqmvsh4hmfkgWgObnDpIZl8oiAMuGGUm2tsuGWKqVcrfcKdGuxiG0ki-Itvou";

const TOTAL_STEPS = 11;

export function ApplicationForm({ onSuccess, onBack }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      facebookProfile: "",
      email: "",
      suburb: "",
      otherSuburb: "",
      timeInArea: "",
      parentType: "",
      childAgeRange: [],
      whyJoin: "",
      goals: "",
      agreeToRules: false,
      antiBotAnswer: "",
    },
  });

  const watchedValues = watch();
  const showOtherSuburb = watchedValues.suburb === "Other";

  const validateCurrentStep = async (): Promise<boolean> => {
    const fieldMap: Record<number, (keyof ApplicationFormData)[]> = {
      1: ["fullName"],
      2: ["facebookProfile"],
      3: ["email"],
      4: showOtherSuburb ? ["suburb", "otherSuburb"] : ["suburb"],
      5: ["timeInArea"],
      6: ["parentType"],
      7: ["childAgeRange"],
      8: ["whyJoin"],
      9: ["goals"],
      10: ["agreeToRules"],
      11: ["antiBotAnswer"],
    };

    const fields = fieldMap[currentStep];
    if (!fields) return true;

    const result = await trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    const messageContent = `**New Albury Parents Network Submission:**

**Full Name:** ${data.fullName}
**Facebook Profile:** ${data.facebookProfile}
**Email:** ${data.email || "Not provided"}
**Suburb:** ${data.suburb === "Other" ? data.otherSuburb : data.suburb}
**Time in Area:** ${data.timeInArea || "Not specified"}
**Parent/Guardian Type:** ${data.parentType}
**Child Age Range:** ${data.childAgeRange?.length ? data.childAgeRange.join(", ") : "Not specified"}
**Reason to Join:** ${data.whyJoin}
**Goals:** ${data.goals || "Not specified"}
**Rules Agreement:** ✅ Agreed
**Anti-Bot Answer:** ${data.antiBotAnswer}`;

    try {
      await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
        }),
      });

      onSuccess();
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Error",
        description: "There was an issue submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep
            title="What's your full name?"
            description="Must match your Facebook name"
            required
          >
            <Input
              {...register("fullName")}
              placeholder="Enter your full name"
              className="text-lg"
            />
            {errors.fullName && (
              <p className="text-destructive text-sm">{errors.fullName.message}</p>
            )}
          </FormStep>
        );

      case 2:
        return (
          <FormStep
            title="Facebook Profile Link"
            description="Share your Facebook profile URL"
            required
          >
            <Input
              {...register("facebookProfile")}
              placeholder="https://facebook.com/yourprofile"
              type="url"
              className="text-lg"
            />
            {errors.facebookProfile && (
              <p className="text-destructive text-sm">
                {errors.facebookProfile.message}
              </p>
            )}
          </FormStep>
        );

      case 3:
        return (
          <FormStep
            title="Email Address"
            description="Used only if admins need to contact you (optional)"
          >
            <Input
              {...register("email")}
              placeholder="your.email@example.com"
              type="email"
              className="text-lg"
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </FormStep>
        );

      case 4:
        return (
          <FormStep title="Which suburb or area do you live in?" required>
            <Select
              value={watchedValues.suburb}
              onValueChange={(value) => setValue("suburb", value)}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select your suburb" />
              </SelectTrigger>
              <SelectContent>
                {SUBURBS.map((suburb) => (
                  <SelectItem key={suburb} value={suburb}>
                    {suburb}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showOtherSuburb && (
              <Input
                {...register("otherSuburb")}
                placeholder="Please specify your suburb"
                className="text-lg mt-4"
              />
            )}
            {errors.suburb && (
              <p className="text-destructive text-sm">{errors.suburb.message}</p>
            )}
          </FormStep>
        );

      case 5:
        return (
          <FormStep
            title="How long have you lived in the area?"
            description="This helps us understand our community (optional)"
          >
            <RadioGroup
              value={watchedValues.timeInArea}
              onValueChange={(value) => setValue("timeInArea", value)}
              className="space-y-3"
            >
              {TIME_IN_AREA.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option} className="text-lg cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormStep>
        );

      case 6:
        return (
          <FormStep title="What best describes you?" required>
            <RadioGroup
              value={watchedValues.parentType}
              onValueChange={(value) => setValue("parentType", value)}
              className="space-y-3"
            >
              {PARENT_TYPES.map((type) => (
                <div
                  key={type}
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type} className="text-lg cursor-pointer flex-1">
                    {type}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errors.parentType && (
              <p className="text-destructive text-sm">{errors.parentType.message}</p>
            )}
          </FormStep>
        );

      case 7:
        return (
          <FormStep
            title="What are the ages of your children?"
            description="Select all that apply (optional)"
          >
            <div className="space-y-3">
              {CHILD_AGE_RANGES.map((range) => (
                <div
                  key={range}
                  className="flex items-center space-x-3 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <Checkbox
                    id={range}
                    checked={watchedValues.childAgeRange?.includes(range)}
                    onCheckedChange={(checked) => {
                      const current = watchedValues.childAgeRange || [];
                      if (checked) {
                        setValue("childAgeRange", [...current, range]);
                      } else {
                        setValue(
                          "childAgeRange",
                          current.filter((r) => r !== range)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={range} className="text-lg cursor-pointer flex-1">
                    {range}
                  </Label>
                </div>
              ))}
            </div>
          </FormStep>
        );

      case 8:
        return (
          <FormStep
            title="Why do you want to join the Albury Parents Network?"
            required
          >
            <Textarea
              {...register("whyJoin")}
              placeholder="Tell us about yourself and why you'd like to join our community..."
              className="text-lg min-h-[150px]"
            />
            {errors.whyJoin && (
              <p className="text-destructive text-sm">{errors.whyJoin.message}</p>
            )}
          </FormStep>
        );

      case 9:
        return (
          <FormStep
            title="What do you hope to get from this group?"
            description="Any specific support, connections, or resources? (optional)"
          >
            <Textarea
              {...register("goals")}
              placeholder="Share your expectations..."
              className="text-lg min-h-[120px]"
            />
            {errors.goals && (
              <p className="text-destructive text-sm">{errors.goals.message}</p>
            )}
          </FormStep>
        );

      case 10:
        return (
          <FormStep title="Group Rules Agreement" required>
            <div className="p-6 rounded-xl bg-secondary/50 space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToRules"
                  checked={watchedValues.agreeToRules}
                  onCheckedChange={(checked) =>
                    setValue("agreeToRules", checked === true)
                  }
                  className="mt-1"
                />
                <Label
                  htmlFor="agreeToRules"
                  className="text-base leading-relaxed cursor-pointer"
                >
                  I agree to follow all group rules and understand I may be removed
                  if I break them
                </Label>
              </div>
            </div>
            {errors.agreeToRules && (
              <p className="text-destructive text-sm">
                {errors.agreeToRules.message}
              </p>
            )}
          </FormStep>
        );

      case 11:
        return (
          <FormStep
            title="Quick verification"
            description="Just to make sure you're human 😊"
            required
          >
            <div className="space-y-4">
              <p className="text-lg font-medium text-foreground">
                What is 4 + 3?
              </p>
              <Input
                {...register("antiBotAnswer")}
                placeholder="Enter your answer"
                className="text-lg max-w-[200px]"
                type="number"
              />
            </div>
            {errors.antiBotAnswer && (
              <p className="text-destructive text-sm">
                {errors.antiBotAnswer.message}
              </p>
            )}
          </FormStep>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-2xl shadow-card p-6 md:p-10 space-y-8">
          {/* Progress */}
          <FormProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrev}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {currentStep === 1 ? "Back to Start" : "Previous"}
              </Button>

              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  variant="default"
                  onClick={handleNext}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="hero"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
