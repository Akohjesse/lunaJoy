import type { MouseEvent } from "react";
import { FcGoogle } from "react-icons/fc";
import { LuChartNoAxesColumnIncreasing as BarChart3, LuHeartHandshake as HeartHandshake, LuLockKeyhole as LockKeyhole } from "react-icons/lu";
import { describeMetric, formatMetricValue, metricDetails, metricKeys } from "../wellbeing";
import { Logo } from "./Logo";

type Props = {
  error: string;
};

const trustItems = [
  { Icon: HeartHandshake, title: "No judgment", copy: "Check in exactly as you are" },
  { Icon: BarChart3, title: "See your patterns", copy: "Understand what supports you" },
  { Icon: LockKeyhole, title: "Your private space", copy: "Your entries stay with you" },
];

const previewValues = {
  mood: 4.2,
  anxiety: 2.1,
  stress: 2,
  sleepHours: 7.5,
};

export function Landing({ error }: Props) {
  const openGoogleSignIn = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const authTab = window.open("about:blank", "_blank");
    if (!authTab) {
      window.location.assign(event.currentTarget.href);
      return;
    }
    authTab.sessionStorage.setItem("lunajoy:google-auth-tab", "true");
    authTab.location.href = event.currentTarget.href;
  };

  return (
    <main className="min-h-screen overflow-hidden bg-cream">
      <nav className="mx-auto flex w-full items-center justify-between bg-brand px-5 py-5.5 min-[701px]:px-[max(32px,calc((100vw-1156px)/2))]">
        <Logo />
        <span className="hidden text-[13px] text-[#e8f0ed] min-[701px]:block">A simple space to check in</span>
      </nav>

      <section className="mx-auto grid min-h-[650px] max-w-[1220px] grid-cols-1 items-center gap-[70px] px-5 pt-10 pb-16 min-[701px]:px-8 min-[701px]:pb-[90px] min-[1001px]:grid-cols-[.9fr_1.1fr] min-[1001px]:pt-[60px]">
        <div className="relative z-2 text-center min-[1001px]:text-left">
          <span className="block text-[11px] font-bold tracking-[.13em] text-[#5d807a] uppercase">Your wellbeing, one day at a time</span>
          <h1 className="mx-auto my-[18px] max-w-[680px] text-[47px] leading-[.98] tracking-[-.055em] min-[701px]:text-[clamp(48px,5.4vw,75px)] min-[1001px]:mx-0">
            See how you’re really doing, <em className="font-serif font-medium text-[#d18a00]">one check-in at a time.</em>
          </h1>
          <p className="mx-auto max-w-[590px] text-base leading-[1.7] text-[#66736e] min-[701px]:text-lg min-[1001px]:mx-0">Track your mood, anxiety, stress, and sleep. No judgment—just a clearer view of what supports you.</p>
          <div className="mt-8.5 flex justify-center min-[1001px]:justify-start">
            <a
              className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-xl border border-accent bg-accent px-4.5 font-bold text-brand no-underline transition-[transform,box-shadow,color] duration-150 ease-[cubic-bezier(.23,1,.32,1)] hover:-translate-y-px hover:text-white hover:shadow-[0_10px_24px_rgba(255,178,28,.32)] active:scale-[.97]"
              href="/api/auth/google"
              onClick={openGoogleSignIn}
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-white">
                <FcGoogle size={20} />
              </span>
              Continue with Google
            </a>
          </div>
          {error && (
            <div className="mx-auto mt-3.5 max-w-[540px] rounded-[10px] bg-[#fae8e3] px-3.5 py-2.5 text-[13px] text-[#8d483c] min-[1001px]:mx-0" role="alert">
              {error}
            </div>
          )}
          <p className="mt-4.5 flex items-center justify-center gap-1.5 text-xs text-[#84908b] min-[1001px]:justify-start">
            <LockKeyhole size={14} />
            Private and confidential.
          </p>
        </div>

        <div className="relative grid min-h-[350px] place-items-center min-[701px]:min-h-[460px] min-[1001px]:min-h-[500px]" aria-hidden="true">
          <div className="absolute top-[-50px] right-[-30px] h-[360px] w-[360px] rounded-full bg-[#dbe7df] blur-[2px] min-[701px]:h-[520px] min-[701px]:w-[520px]" />
          <div className="absolute bottom-[-50px] left-[-40px] h-[290px] w-[290px] rounded-full bg-[#f4d7be] opacity-80 blur-[2px]" />
          <div className="relative z-1 w-[min(100%,570px)] rotate-1 rounded-[26px] border border-white/85 bg-[rgba(255,253,249,.9)] p-[19px] shadow-[0_34px_80px_rgba(46,67,59,.18)] min-[701px]:p-7">
            <div className="flex justify-between text-[13px] font-bold">
              <span>Today’s check-in</span>
              <span className="rounded-full bg-[#e2ece6] px-2.5 py-1 text-[#527469]">Complete</span>
            </div>
            <div className="flex items-center gap-3.5 border-b border-line py-7">
              <div className="grid h-11.5 w-11.5 place-items-center rounded-[15px] bg-[#fceddc] text-[22px] text-[#d8864f]">☀</div>
              <div>
                <small className="text-muted">Monday, August 17</small>
                <h3 className="mt-1 mb-0 text-[19px]">You took a moment for yourself.</h3>
              </div>
            </div>
            <div className="my-6 grid grid-cols-2 gap-2 min-[701px]:gap-3">
              {metricKeys.map((metric) => (
                <div className="flex flex-col rounded-[14px] bg-[#f5f3ed] p-3 min-[701px]:p-[15px]" key={metric}>
                  <span className="text-[9px] tracking-[.13em] text-muted">{metricDetails[metric].label.toUpperCase()}</span>
                  <strong className="my-1.5 text-[19px] min-[701px]:text-[23px]">{formatMetricValue(metric, previewValues[metric], true)}</strong>
                  <small className="text-muted">{describeMetric(metric, previewValues[metric])}</small>
                </div>
              ))}
            </div>
            <div className="h-[100px] rounded-[14px] bg-[#faf8f2] p-2.5">
              <svg className="h-full w-full" viewBox="0 0 420 100" preserveAspectRatio="none">
                <path d="M0,70 C45,84 70,45 110,54 S175,88 216,46 S280,20 320,42 S370,74 420,28" fill="none" stroke="#e89c66" strokeWidth="4" strokeLinecap="round" />
                <path d="M0,82 C45,69 72,77 112,70 S176,40 220,58 S280,82 322,64 S370,38 420,50" fill="none" stroke="#74938a" strokeWidth="3" strokeLinecap="round" />
                <path d="M0,55 C48,48 72,67 115,62 S178,30 220,48 S282,67 325,55 S375,44 420,58" fill="none" stroke="#c77768" strokeWidth="3" strokeLinecap="round" />
                <path d="M0,34 C46,43 76,28 118,36 S178,55 220,31 S280,22 324,35 S372,43 420,25" fill="none" stroke="#a98fc4" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mb-12.5 grid max-w-[520px] grid-cols-1 gap-7.5 border-t border-[#dfdbd1] px-5 py-7 min-[701px]:px-8 min-[1001px]:max-w-[1220px] min-[1001px]:grid-cols-3">
        {trustItems.map(({ Icon, title, copy }) => (
          <div className="flex items-center gap-3.5" key={title}>
            <Icon className="text-[#6e8d83]" />
            <span className="flex flex-col gap-1">
              <strong className="text-[13px]">{title}</strong>
              <small className="text-muted">{copy}</small>
            </span>
          </div>
        ))}
      </section>
    </main>
  );
}
