import { CheckCircle, Mail, Clock } from "lucide-react";

export function SuccessScreen() {
  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center p-4">
      <div className="max-w-lg w-full animate-scale-in">
        <div className="bg-card rounded-2xl shadow-card p-8 md:p-12 text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center animate-pulse-soft">
              <CheckCircle className="w-14 h-14 text-accent" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-foreground">
              Success!
            </h1>
            <p className="text-xl text-accent font-semibold">
              Your application has been submitted
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-secondary/50 rounded-xl p-6 space-y-4 text-left">
            <h2 className="font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              What happens next?
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span>
                  Please wait for an email from an admin to see if you are approved to join the Facebook group.
                </span>
              </li>
            </ul>
          </div>

          {/* Decorative */}
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                style={{ opacity: 1 - i * 0.25 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
