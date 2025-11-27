import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCards({ title, value, icon: Icon, gradient }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-r ${gradient} rounded-full opacity-10`} />
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                {value}
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-20 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}