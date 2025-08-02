"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AppointmentScheduler() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    donorName: "",
    bloodType: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];

  /** Fetch Appointments */
  useEffect(() => {
    async function fetchAppointments() {
      try {
        const res = await fetch("/api/appointments");
        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  /** Filter Appointments */
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.donorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || appointment.status === filterStatus;
    const matchesDate =
      filterDate === "" || appointment.appointmentDate === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  /** Utility for status badges */
  const getStatusBadge = (status) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4 text-blue-500 mr-1" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500 mr-1" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500 mr-1" />;
      default:
        return null;
    }
  };

  /** Add Appointment */
  const handleAddAppointment = async () => {
    if (
      !newAppointment.donorName ||
      !newAppointment.bloodType ||
      !newAppointment.appointmentDate ||
      !newAppointment.appointmentTime
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAppointment,
          status: "scheduled",
        }),
      });
      if (!res.ok) throw new Error("Failed to add appointment");
      const appointment = await res.json();
      setAppointments((prev) => [...prev, appointment]);

      // Reset form
      setNewAppointment({
        donorName: "",
        bloodType: "",
        appointmentDate: "",
        appointmentTime: "",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  /** Update Status */
  const updateAppointmentStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === id ? updated : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  /** Delete Appointment */
  const handleDeleteAppointment = async (id) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete appointment");

      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== id)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  /** Loading State */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment Scheduler</h1>
          <p className="text-muted-foreground">
            Schedule and manage blood donation appointments
          </p>
        </div>
        {/* Add Appointment Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>
                Enter the required appointment details.
              </DialogDescription>
            </DialogHeader>
            {/* Form */}
            <div className="grid gap-4 py-4">
              {/* Donor Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right">Donor Name</label>
                <Input
                  type="text"
                  value={newAppointment.donorName}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      donorName: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              {/* Blood Type */}
              <Select
                value={newAppointment.bloodType}
                onValueChange={(value) =>
                  setNewAppointment({ ...newAppointment, bloodType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date */}
              <Input
                type="date"
                value={newAppointment.appointmentDate}
                onChange={(e) =>
                  setNewAppointment({
                    ...newAppointment,
                    appointmentDate: e.target.value,
                  })
                }
              />

              {/* Time */}
              <Select
                value={newAppointment.appointmentTime}
                onValueChange={(value) =>
                  setNewAppointment({ ...newAppointment, appointmentTime: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddAppointment}>Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by donor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{appointment.donorName}</h3>
                    <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        {appointment.bloodType}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {appointment.appointmentDate} at{" "}
                        {appointment.appointmentTime}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusBadge(appointment.status)}>
                    {getStatusIcon(appointment.status)}
                    {appointment.status}
                  </Badge>
                  <div className="flex space-x-1">
                    {appointment.status === "scheduled" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "completed"
                            )
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateAppointmentStatus(
                              appointment._id,
                              "cancelled"
                            )
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAppointment(appointment._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No appointments found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
