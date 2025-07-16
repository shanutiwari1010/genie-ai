"use client";

import React, { useEffect, useState } from "react";
import Loading from "@/components/ui/loading";
import Image from "next/image";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notificationsData] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  return (
    <div className="max-w-full m-4 md:px-0 flex flex-col flex-wrap gap-8">
      <div className="flex justify-between flex-wrap items-start gap-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-5xl sm:text-4xl md:text-4xl lg:text-5xl font-semibold">
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay informed with important updates and alerts.
          </p>
        </div>
      </div>

      {loading && <Loading />}

      <div className="flex flex-col gap-8">
        {!notificationsData?.length && !loading && (
          <div className="flex flex-col items-center text-center max-w-sm mx-auto">
            <Image
              priority
              width={100}
              height={100}
              loading="eager"
              src="/notification.gif"
              alt="No conversations"
              className="w-[100px] h-[100px] rounded-2xl overflow-hidden"
            />
            <div className="mt-4 flex flex-col gap-2">
              <h3 className="text-lg font-normal">You&apos;re All Caught Up</h3>
              <p className="text-muted-foreground">
                Feel free to explore the platform or check back later for fresh
                insights. Stay Tuned!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
