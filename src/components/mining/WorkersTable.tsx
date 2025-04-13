
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

type Worker = {
  id: string;
  name: string;
  status: "online" | "offline";
  hashrate: string;
  shares: number;
  temperature: string;
  power: string;
  uptime: string;
  efficiency: string;
};

const workers: Worker[] = [
  { id: "1", name: "Quantum Accelerator", status: "online", hashrate: "75.50 MH/s", shares: 0, temperature: "65°C", power: "120W", uptime: "1d 0h 0m", efficiency: "70%" },
  { id: "2", name: "Neural Processor", status: "online", hashrate: "45.50 MH/s", shares: 0, temperature: "62°C", power: "110W", uptime: "1d 0h 0m", efficiency: "65%" },
  { id: "3", name: "Chaos Engine", status: "online", hashrate: "55.50 MH/s", shares: 0, temperature: "68°C", power: "130W", uptime: "1d 0h 0m", efficiency: "75%" },
  { id: "4", name: "Hybrid Miner", status: "online", hashrate: "40.50 MH/s", shares: 0, temperature: "60°C", power: "100W", uptime: "1d 0h 0m", efficiency: "60%" },
  { id: "5", name: "Quantum Lite", status: "online", hashrate: "35.50 MH/s", shares: 0, temperature: "58°C", power: "90W", uptime: "1d 0h 0m", efficiency: "55%" },
  { id: "6", name: "Neural Lite", status: "online", hashrate: "30.50 MH/s", shares: 0, temperature: "55°C", power: "85W", uptime: "1d 0h 0m", efficiency: "50%" },
  { id: "7", name: "Chaos Lite", status: "online", hashrate: "25.50 MH/s", shares: 0, temperature: "52°C", power: "80W", uptime: "1d 0h 0m", efficiency: "45%" },
];

const WorkersTable = ({ isActive }: { isActive: boolean }) => {
  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Workers</h2>
          <Button className="bg-sphere-green text-black hover:bg-green-400">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id} className="border-b border-gray-800">
                  <TableCell className="py-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-sphere-green mr-2"></div>
                      {worker.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="bg-sphere-green bg-opacity-20 text-sphere-green text-xs px-2 py-1 rounded-full">
                      {isActive ? worker.status : "offline"}
                    </span>
                  </TableCell>
                  <TableCell>{isActive ? worker.hashrate : "0.00 MH/s"}</TableCell>
                  <TableCell>
                    <span className="text-sphere-green">{isActive ? Math.floor(Math.random() * 10) : 0}</span>{" "}
                    <span className="text-red-400">{isActive ? Math.floor(Math.random() * 2) : 0}</span>{" "}
                    <span className="text-yellow-400">{isActive ? Math.floor(Math.random() * 3) : 0}</span>
                  </TableCell>
                  <TableCell>{isActive ? worker.temperature : "N/A"}</TableCell>
                  <TableCell>{isActive ? worker.power : "0W"}</TableCell>
                  <TableCell>{isActive ? worker.uptime : "0d 0h 0m"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkersTable;
