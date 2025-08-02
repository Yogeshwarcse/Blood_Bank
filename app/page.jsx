"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Droplets, Calendar, Heart, AlertTriangle } from "lucide-react";

import Navigation from "@/components/Navigation";
import DonorManagement from "@/components/DonorManagement";
import BloodInventory from "@/components/BloodInventory";
import AppointmentScheduler from "@/components/AppointmentScheduler";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hydrated, setHydrated] = useState(false);

  // Fix hydration issues
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  // Dashboard sample data
  const dashboardStats = {
    totalDonors: 1247,
    upcomingAppointments: 23,
    bloodUnitsAvailable: 456,
  };

  const bloodTypeInventory = [
    { type: "O+", units: 45, percentage: 78, status: "good" },
    { type: "A+", units: 32, percentage: 65, status: "medium" },
    { type: "B+", units: 28, percentage: 60, status: "medium" },
    { type: "AB+", units: 15, percentage: 45, status: "low" },
    { type: "O-", units: 12, percentage: 30, status: "critical" },
    { type: "A-", units: 18, percentage: 40, status: "low" },
    { type: "B-", units: 14, percentage: 35, status: "low" },
    { type: "AB-", units: 8, percentage: 20, status: "critical" },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      good: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Dashboard cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.totalDonors.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.upcomingAppointments}</div>
                  <p className="text-xs text-muted-foreground">Next 7 days</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Blood Units Available</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats.bloodUnitsAvailable}</div>
                  <p className="text-xs text-muted-foreground">All blood types</p>
                </CardContent>
              </Card>
            </div>

            {/* Blood inventory */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-red-500" />
                  Blood Type Inventory
                </CardTitle>
                <CardDescription>Current blood units available by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {bloodTypeInventory.map((blood) => (
                    <div key={blood.type} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{blood.type}</h3>
                        <Badge className={getStatusBadge(blood.status)}>{blood.status}</Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">{blood.units} units</div>
                      <Progress value={blood.percentage} className="h-2" />
                      <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                        <span>{blood.percentage}% capacity</span>
                        {blood.status === "critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "donors":
        return <DonorManagement />;
      case "inventory":
        return <BloodInventory />;
      case "appointments":
        return <AppointmentScheduler />;
      case "reports":
        return <Reports />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
} 