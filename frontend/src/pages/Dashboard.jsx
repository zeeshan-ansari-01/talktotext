import { useSelector } from "react-redux";

import BgGradient from "@/components/common/BgGradient";
import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/UpgradeYourPlan";
import UploadForm from "@/components/upload/UploadForm";

const PLAN_NAMES = { starter: "Starter", basic: "Basic", pro: "Pro" };

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);

  const planTypeId = user.plan || "starter";
  const planTypeName = PLAN_NAMES[planTypeId];

  const isBasicPlan = planTypeId === "basic";
  const isProPlan = planTypeId === "pro";

  // Basic plan mein sirf 3 posts
  const isValidBasicPlan = isBasicPlan && user.postsCount < 3;

  return (
    <BgGradient>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="bg-gradient-to-r from-purple-700 to-pink-800 text-white px-4 py-1 text-lg font-semibold capitalize">
            {planTypeName} Plan
          </Badge>

          <h2 className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start creating amazing content
          </h2>

          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
            Upload your audio or video file and let our AI do the magic!
          </p>

          {(isBasicPlan || isProPlan) && (
            <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
              You get{" "}
              <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
                {isBasicPlan ? "3" : "Unlimited"} blog posts
              </span>{" "}
              as part of the{" "}
              <span className="font-bold capitalize">{planTypeName}</span> Plan.
            </p>
          )}

          {isValidBasicPlan || isProPlan ? (
            <BgGradient>
              <UploadForm />
            </BgGradient>
          ) : (
            <UpgradeYourPlan />
          )}
        </div>
      </div>
    </BgGradient>
  );
}