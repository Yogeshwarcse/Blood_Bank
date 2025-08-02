"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, AlertTriangle, Droplets, Search, Clock, CheckCircle2 } from "lucide-react";

// Modal Components from shadcn-ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function BloodInventory() {
  const [bloodUnits, setBloodUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodType, setFilterBloodType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");

  // Modal (Add Blood Unit)
  const [open, setOpen] = useState(false);
  const [newUnit, setNewUnit] = useState({
    bagNumber: "",
    bloodType: "",
    donationDate: "",
    expiryDate: "",
    donorName: "",
    location: "",
    volume: 450,
    status: "available",
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const locations = ["Main Storage", "Satellite Storage", "Emergency Storage"];
  const statuses = ["available", "reserved", "expired", "used"];

  // Fetch Units from API
  useEffect(() => {
    fetchUnits();
  }, []);

  async function fetchUnits() {
    try {
      const res = await fetch("/api/blood-units");
      const data = await res.json();
      setBloodUnits(data);
    } catch (error) {
      console.error("Error fetching blood units:", error);
    } finally {
      setLoading(false);
    }
  }

  // Add New Blood Unit
  async function handleAddUnit() {
    try {
      const res = await fetch("/api/blood-units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUnit),
      });

      if (res.ok) {
        setOpen(false);
        setNewUnit({
          bagNumber: "",
          bloodType: "",
          donationDate: "",
          expiryDate: "",
          donorName: "",
          location: "",
          volume: 450,
          status: "available",
        });
        fetchUnits();
      } else {
        alert("Failed to add blood unit");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  }

  // Filters
  const filteredUnits = bloodUnits.filter((unit) => {
    const matchesSearch =
      unit.bagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.donorName && unit.donorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBloodType = filterBloodType === "all" || unit.bloodType === filterBloodType;
    const matchesStatus = filterStatus === "all" || unit.status === filterStatus;
    const matchesLocation = filterLocation === "all" || unit.location === filterLocation;

    return matchesSearch && matchesBloodType && matchesStatus && matchesLocation;
  });

  // UI Helpers
  const getStatusBadge = (status) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      reserved: "bg-blue-100 text-blue-800",
      expired: "bg-red-100 text-red-800",
      used: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "reserved": return <Clock className="h-4 w-4 text-blue-500" />;
      case "expired": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDate) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 7) return "expiring-soon";
    if (daysUntilExpiry <= 30) return "expiring-month";
    return "good";
  };

  const getExpiryColor = (expiryDate) => {
    const status = getExpiryStatus(expiryDate);
    const colors = {
      expired: "text-red-600",
      "expiring-soon": "text-orange-600",
      "expiring-month": "text-yellow-600",
      good: "text-green-600",
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blood Inventory</h1>
          <p className="text-muted-foreground">Manage blood units and track inventory levels</p>
        </div>

        {/* Add Blood Unit Button + Modal */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Add Blood Unit
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Blood Unit</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <Input
                placeholder="Bag Number"
                value={newUnit.bagNumber}
                onChange={(e) => setNewUnit({ ...newUnit, bagNumber: e.target.value })}
              />
              <Input
                placeholder="Donor Name"
                value={newUnit.donorName}
                onChange={(e) => setNewUnit({ ...newUnit, donorName: e.target.value })}
              />
              <Select
                value={newUnit.bloodType}
                onValueChange={(val) => setNewUnit({ ...newUnit, bloodType: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Blood Type" />
                </SelectTrigger>
                <SelectContent>
                  {bloodTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newUnit.donationDate}
                onChange={(e) => setNewUnit({ ...newUnit, donationDate: e.target.value })}
              />
              <Input
                type="date"
                value={newUnit.expiryDate}
                onChange={(e) => setNewUnit({ ...newUnit, expiryDate: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={newUnit.location}
                onChange={(e) => setNewUnit({ ...newUnit, location: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Volume (ml)"
                value={newUnit.volume}
                onChange={(e) => setNewUnit({ ...newUnit, volume: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddUnit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredUnits.length}</div>
            <p className="text-xs text-muted-foreground">Blood units in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {bloodUnits.filter((unit) => unit.status === "available").length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {bloodUnits.filter((unit) => unit.status === "reserved").length}
            </div>
            <p className="text-xs text-muted-foreground">Pending orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {bloodUnits.filter((unit) => unit.status === "expired").length}
            </div>
            <p className="text-xs text-muted-foreground">Needs disposal</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by bag number or donor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBloodType} onValueChange={setFilterBloodType}>
              <SelectTrigger>
                <SelectValue placeholder="Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Types</SelectItem>
                {bloodTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Blood Units List */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Units ({filteredUnits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredUnits.length > 0 ? (
            <div className="space-y-4">
              {filteredUnits.map((unit) => (
                <div
                  key={unit._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                      <Droplets className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{unit.bagNumber}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Droplets className="h-3 w-3 mr-1" />
                          {unit.bloodType}
                        </span>
                        <span>{unit.donorName || "N/A"}</span>
                        <span>{unit.location || "No Location"}</span>
                        <span className={getExpiryColor(unit.expiryDate)}>
                          Expires: {unit.expiryDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusBadge(unit.status)}>
                      {getStatusIcon(unit.status)}
                      {unit.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{unit.volume}ml</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No blood units found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
