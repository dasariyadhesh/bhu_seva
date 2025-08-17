
import { HandHeart, LucideProps, Milestone, Sprout as SproutIcon, Users as UsersIcon, ShieldCheck } from "lucide-react";

export const Icons = {
  logo: (props: LucideProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
      <path d="M12 4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" opacity="0.3"></path>
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"></path>
      <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" opacity="0.5"></path>
    </svg>
  ),
  google: (props: LucideProps) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 2.04-4.82 2.04-5.84 0-10.62-4.78-10.62-10.62s4.78-10.62 10.62-10.62c3.32 0 5.62 1.36 6.96 2.62l2.5-2.5C20.46 1.48 17.02 0 12.48 0 5.6 0 0 5.6 0 12.48s5.6 12.48 12.48 12.48c7.2 0 12.04-4.12 12.04-12.24 0-.78-.08-1.56-.2-2.32H12.48z" />
    </svg>
  ),
  Temple: Milestone,
  Donate: HandHeart,
  Sprout: SproutIcon,
  Users: UsersIcon,
  Admin: ShieldCheck,
};
