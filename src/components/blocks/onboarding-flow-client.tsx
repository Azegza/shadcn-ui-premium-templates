"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRight, ArrowLeft, Check, Sparkles, Building2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const onboardingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  role: z.string().min(1, "Please select a role."),
  workspaceName: z.string().min(2, "Workspace name is required."),
  workspaceSlug: z.string().min(2, "Workspace URL is required."),
  invites: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

const STEPS = [
  { id: "profile", title: "Your Profile", icon: Sparkles },
  { id: "workspace", title: "Workspace", icon: Building2 },
  { id: "invite", title: "Team", icon: Users },
];

export function OnboardingClient() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

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
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  }

  function prevStep() {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  const [isSuccess, setIsSuccess] = useState(false);

  function onSubmit(data: OnboardingFormValues) {
    console.log("Onboarding Complete:", data);
    setIsSuccess(true);
  }

  const variants: Variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
    }),
    active: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <div className="relative w-full rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-xl shadow-zinc-200/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/50 dark:shadow-zinc-900/50 sm:p-10">
      
      {/* ── Progress Indicator ── */}
      {!isSuccess && (
        <div className="mb-10 relative">
          <div className="absolute top-1/2 start-0 h-0.5 w-full -translate-y-1/2 bg-zinc-100 dark:bg-zinc-800" />
          <div 
            className="absolute top-1/2 start-0 h-0.5 -translate-y-1/2 bg-violet-600 transition-all duration-500 ease-out dark:bg-violet-500" 
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = currentStep > idx;
              const isActive = currentStep === idx;
              
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 z-10">
                  <div 
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300",
                      isCompleted 
                        ? "border-violet-600 bg-violet-600 text-white dark:border-violet-500 dark:bg-violet-500" 
                        : isActive 
                          ? "border-violet-600 bg-white text-violet-600 dark:border-violet-500 dark:bg-zinc-950 dark:text-violet-400" 
                          : "border-zinc-200 bg-white text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500"
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" strokeWidth={3} /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className={cn(
                    "hidden text-xs font-semibold sm:block transition-colors",
                    isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"
                  )}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative overflow-hidden min-h-[350px]">
            <AnimatePresence mode="popLayout" custom={direction}>
              
              {isSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex min-h-[350px] flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400">
                    <Check className="h-10 w-10" strokeWidth={3} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">All set!</h2>
                    <p className="text-zinc-500 dark:text-zinc-400">Your workspace has been created successfully.</p>
                  </div>
                  <Button type="button" variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Restart Demo
                  </Button>
                </motion.div>
              )}

              {/* ── Step 1: Profile ── */}
              {!isSuccess && currentStep === 0 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  className="w-full space-y-6"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome aboard!</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Let's start by getting to know you.</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="h-11" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {["Developer", "Designer", "Manager", "Other"].map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => field.onChange(role)}
                              className={cn(
                                "flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900",
                                field.value === role 
                                  ? "border-violet-600 bg-violet-50 text-violet-700 dark:border-violet-500 dark:bg-violet-500/10 dark:text-violet-300"
                                  : "border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                              )}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button type="button" onClick={() => nextStep(["fullName", "role"])} className="w-full h-11 group">
                      Continue
                      <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Workspace ── */}
              {!isSuccess && currentStep === 1 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  className="w-full space-y-6"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Create Workspace</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">This is where your team will collaborate.</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="workspaceName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Acme Corp" 
                            className="h-11" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              // Auto-generate slug if it's empty or untouched
                              const currentSlug = form.getValues("workspaceSlug");
                              if (!currentSlug || currentSlug === e.target.value.slice(0, -1).toLowerCase().replace(/\s+/g, '-')) {
                                form.setValue("workspaceSlug", e.target.value.toLowerCase().replace(/\s+/g, '-'), { shouldValidate: true });
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workspaceSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace URL</FormLabel>
                        <FormControl>
                          <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-s-md border border-e-0 border-zinc-200 bg-zinc-50 px-3 text-zinc-500 sm:text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                              app.acme.com/
                            </span>
                            <Input placeholder="acme-corp" className="h-11 rounded-s-none" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={prevStep} className="h-11 px-4">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button type="button" onClick={() => nextStep(["workspaceName", "workspaceSlug"])} className="w-full h-11 group">
                      Continue
                      <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Invite ── */}
              {!isSuccess && currentStep === 2 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={variants}
                  initial="initial"
                  animate="active"
                  exit="exit"
                  className="w-full space-y-6"
                >
                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Invite your team</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Get your team on board right away. You can also do this later.</p>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="invites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Addresses</FormLabel>
                        <FormControl>
                          <textarea 
                            placeholder="alice@example.com, bob@example.com" 
                            className="flex min-h-[120px] w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:placeholder:text-zinc-500 dark:focus-visible:ring-violet-500 resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Separate multiple emails with commas.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col-reverse gap-3 sm:flex-row pt-4">
                    <Button type="button" variant="ghost" onClick={prevStep} className="h-11 px-4 sm:w-24">
                      Back
                    </Button>
                    <Button type="submit" className="w-full h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-lg shadow-zinc-900/20 dark:shadow-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      Complete Setup
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Form>
    </div>
  );
}
