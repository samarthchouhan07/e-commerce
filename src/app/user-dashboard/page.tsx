"use client"

import { UserProfile } from "@/components/user-dashboard"
import { useUser } from "@clerk/nextjs"

export default function UserDashboardPage(){
    const {user}=useUser()
    const userId=user?.id
    if(!userId) return 

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <UserProfile userId={userId}/>
        </div>
    )
}