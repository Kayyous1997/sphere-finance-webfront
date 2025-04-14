
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash, Edit, Save, X } from "lucide-react";
import { MiningWorker } from "@/services/miningService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface WorkersTableProps {
  isActive: boolean;
  workers: MiningWorker[];
  onAddWorker: (worker: Partial<MiningWorker>) => Promise<void>;
  onUpdateWorker: (workerId: string, updates: Partial<MiningWorker>) => Promise<void>;
  onDeleteWorker: (workerId: string) => Promise<void>;
}

const WorkersTable = ({ 
  isActive, 
  workers = [], 
  onAddWorker, 
  onUpdateWorker, 
  onDeleteWorker 
}: WorkersTableProps) => {
  const [addWorkerOpen, setAddWorkerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editWorkerId, setEditWorkerId] = useState<string | null>(null);
  const [workerToDelete, setWorkerToDelete] = useState<string | null>(null);
  const [newWorker, setNewWorker] = useState({
    name: "",
    type: "gpu",
    hashrate: 45.5,
    temperature: 65,
    power: 120,
  });
  const [editValues, setEditValues] = useState<Partial<MiningWorker>>({});

  const handleAddWorker = async () => {
    if (!newWorker.name) {
      toast.error("Worker name is required");
      return;
    }

    try {
      await onAddWorker({
        name: newWorker.name,
        worker_type: newWorker.type,
        hashrate: newWorker.hashrate,
        temperature: newWorker.temperature,
        power_usage: newWorker.power,
        status: "offline",
        hardware_details: {
          cpu: "AMD Ryzen 9 5900X",
          gpu: "RTX 3080 Ti",
          memory: "32GB DDR4-3600",
          storage: "1TB NVMe SSD"
        }
      });
      
      setAddWorkerOpen(false);
      setNewWorker({
        name: "",
        type: "gpu",
        hashrate: 45.5,
        temperature: 65,
        power: 120,
      });
    } catch (error) {
      console.error("Error adding worker:", error);
    }
  };

  const handleDeleteWorker = async () => {
    if (workerToDelete) {
      try {
        await onDeleteWorker(workerToDelete);
        setDeleteConfirmOpen(false);
        setWorkerToDelete(null);
      } catch (error) {
        console.error("Error deleting worker:", error);
      }
    }
  };

  const handleEditSave = async (workerId: string) => {
    try {
      await onUpdateWorker(workerId, editValues);
      setEditWorkerId(null);
      setEditValues({});
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const startEdit = (worker: MiningWorker) => {
    setEditWorkerId(worker.id);
    setEditValues({
      name: worker.name,
      worker_type: worker.worker_type,
      hashrate: worker.hashrate,
      temperature: worker.temperature,
      power_usage: worker.power_usage,
      status: worker.status
    });
  };

  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Workers</h2>
          <Button 
            className="bg-sphere-green text-black hover:bg-green-400"
            onClick={() => setAddWorkerOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Worker
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-800">
                <TableHead className="text-left">Name</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Hashrate</TableHead>
                <TableHead className="text-left">Shares</TableHead>
                <TableHead className="text-left">Temperature</TableHead>
                <TableHead className="text-left">Power</TableHead>
                <TableHead className="text-left">Uptime</TableHead>
                <TableHead className="text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No workers found. Add a worker to get started.
                  </TableCell>
                </TableRow>
              ) : (
                workers.map((worker) => (
                  <TableRow key={worker.id} className="border-b border-gray-800">
                    <TableCell className="py-2">
                      {editWorkerId === worker.id ? (
                        <Input
                          value={editValues.name || ""}
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          className="bg-sphere-card-dark border-gray-700"
                        />
                      ) : (
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full ${
                            isActive && worker.status === 'online' ? 'bg-sphere-green' : 'bg-gray-500'
                          } mr-2`}></div>
                          {worker.name}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`${
                        isActive && worker.status === 'online'
                          ? 'bg-sphere-green bg-opacity-20 text-sphere-green'
                          : 'bg-gray-700 bg-opacity-20 text-gray-400'
                        } text-xs px-2 py-1 rounded-full`}>
                        {isActive && worker.status === 'online' ? 'online' : 'offline'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {isActive && worker.status === 'online'
                        ? `${worker.hashrate.toFixed(2)} MH/s`
                        : "0.00 MH/s"}
                    </TableCell>
                    <TableCell>
                      {isActive && worker.status === 'online' ? (
                        <>
                          <span className="text-sphere-green">{Math.floor(Math.random() * 10)}</span>{" "}
                          <span className="text-red-400">{Math.floor(Math.random() * 2)}</span>{" "}
                          <span className="text-yellow-400">{Math.floor(Math.random() * 3)}</span>
                        </>
                      ) : (
                        <span>0 0 0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {isActive && worker.status === 'online'
                        ? `${worker.temperature}°C`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {isActive && worker.status === 'online'
                        ? `${worker.power_usage}W`
                        : "0W"}
                    </TableCell>
                    <TableCell>
                      {isActive && worker.status === 'online'
                        ? "1d 0h 0m"
                        : "0d 0h 0m"}
                    </TableCell>
                    <TableCell>
                      {editWorkerId === worker.id ? (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSave(worker.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditWorkerId(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(worker)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setWorkerToDelete(worker.id);
                              setDeleteConfirmOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Add Worker Dialog */}
      <Dialog open={addWorkerOpen} onOpenChange={setAddWorkerOpen}>
        <DialogContent className="bg-sphere-card border-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Worker</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Worker Name</Label>
              <Input
                id="name"
                placeholder="e.g. Quantum Accelerator"
                value={newWorker.name}
                onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                className="bg-sphere-card-dark border-gray-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Worker Type</Label>
              <Input
                id="type"
                placeholder="e.g. GPU"
                value={newWorker.type}
                onChange={(e) => setNewWorker({ ...newWorker, type: e.target.value })}
                className="bg-sphere-card-dark border-gray-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hashrate">Hashrate (MH/s)</Label>
                <Input
                  id="hashrate"
                  type="number"
                  value={newWorker.hashrate}
                  onChange={(e) => setNewWorker({ ...newWorker, hashrate: parseFloat(e.target.value) })}
                  className="bg-sphere-card-dark border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  value={newWorker.temperature}
                  onChange={(e) => setNewWorker({ ...newWorker, temperature: parseFloat(e.target.value) })}
                  className="bg-sphere-card-dark border-gray-700"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="power">Power (W)</Label>
              <Input
                id="power"
                type="number"
                value={newWorker.power}
                onChange={(e) => setNewWorker({ ...newWorker, power: parseFloat(e.target.value) })}
                className="bg-sphere-card-dark border-gray-700"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleAddWorker} className="bg-sphere-green text-black hover:bg-green-400">
              Add Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="bg-sphere-card border-gray-800">
          <DialogHeader>
            <DialogTitle>Delete Worker</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this worker? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDeleteWorker} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WorkersTable;
