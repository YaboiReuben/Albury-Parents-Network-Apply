import { Button } from "@/components/ui/button";
import { Heart, Users, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-scale-in">
        <div className="bg-card rounded-2xl shadow-card p-8 md:p-12 space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full gradient-warm flex items-center justify-center shadow-glow">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Albury Parents Network
            </h1>
            <p className="text-xl text-primary font-semibold">
              Membership Application
            </p>
          </div>

          {/* Description */}
          <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
            <p className="text-foreground leading-relaxed">
              Welcome! Click <strong>"Open Application"</strong> to start. You will be asked a series of short questions about yourself and your family.
            </p>
            <p className="text-muted-foreground">
              Once submitted, you'll see a success message and then wait for an email from an admin confirming approval to join our community.
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              <span>Supportive Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Local Parents</span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center pt-4">
            <Button
              variant="hero"
              size="lg"
              onClick={onStart}
              className="group"
            >
              Open Application
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
