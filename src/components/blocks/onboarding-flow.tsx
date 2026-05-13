"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRight, ArrowLeft, Check, User, Buildings as Building2, Users } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Schema ─────────────────────────────────────────────────────────────────

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  role: z.string().min(1, "Please select a role."),
  workspaceName: z.string().min(2, "Workspace name must be at least 2 characters."),
  workspaceSlug: z.string().min(2, "Workspace slug must be at least 2 characters."),
  invites: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const STEPS = [
  { id: "profile", title: "Your Profile", icon: User },
  { id: "workspace", title: "Workspace", icon: Building2 },
  { id: "invite", title: "Team", icon: Users },
];

// ─── Main Block ─────────────────────────────────────────────────────────────

export function OnboardingFlowBlock() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      fullName: "",
      role: "",
      workspaceName: "",
      workspaceSlug: "",
      invites: "",
    },
    mode: "onChange",
  });

  async function nextStep(fieldsToValidate: (keyof OnboardingFormValues)[]) {
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  function onSubmit(data: OnboardingFormValues) {
    console.log("Onboarding Complete:", data);
    setIsSuccess(true);
  }

  return (
    <section className="bg-zinc-50 px-4 py-24 dark:bg-zinc-950 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        
        {/* Progress */}
        {!isSuccess && (
          <div className="mb-10 flex justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = currentStep > idx;
              const isActive = currentStep === idx;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border transition-colors",
                    isCompleted ? "bg-violet-600 border-violet-600 text-white" : isActive ? "border-violet-600 text-violet-600" : "border-zinc-200 text-zinc-400"
                  )}>
                    {isCompleted ? <Check size={16} weight="bold" /> : <Icon size={16} />}
                  </div>
                  <span className={cn("text-xs font-medium", isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400")}>{step.title}</span>
                </div>
              );
            })}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {isSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Check size={32} weight="bold" />
                </div>
                <h2 className="text-2xl font-bold">Success!</h2>
                <p className="text-zinc-500">Your workspace is ready.</p>
                <Button onClick={() => window.location.reload()}>Finish</Button>
              </div>
            ) : (
              <div className="min-h-[300px]">
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold">Welcome</h2>
                      <p className="text-sm text-zinc-500">Let&apos;s set up your profile.</p>
                    </div>
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {["Developer", "Designer", "Manager", "Other"].map(r => (
                            <Button key={r} type="button" variant={field.value === r ? "default" : "outline"} onClick={() => field.onChange(r)} className="w-full">{r}</Button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="button" onClick={() => nextStep(["fullName", "role"])} className="w-full">
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold">Workspace</h2>
                      <p className="text-sm text-zinc-500">Where will you work?</p>
                    </div>
                    <FormField control={form.control} name="workspaceName" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl><Input placeholder="Acme Inc" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                      <Button type="button" onClick={() => nextStep(["workspaceName", "workspaceSlug"])} className="w-full">Next Step <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold">Invite Team</h2>
                      <p className="text-sm text-zinc-500">Add your collaborators.</p>
                    </div>
                    <FormField control={form.control} name="invites" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emails (comma separated)</FormLabel>
                        <FormControl><Input placeholder="alice@acme.com, bob@acme.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                      <Button type="submit" className="w-full">Complete Onboarding</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </Form>
      </div>
    </section>
  );
}
