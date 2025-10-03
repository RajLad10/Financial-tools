import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { SIPCalculator } from '@/components/calculators/SIPCalculator';
import { EMICalculator } from '@/components/calculators/EMICalculator';

export default function Tools() {
  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Financial Tools
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Calculate investments and loan payments with ease.
          </p>
        </div>

        <Tabs defaultValue="sip" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <TabsList className="p-0 grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
              <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="sip">
            <div className="card-surface elevation-1 p-4 sm:p-6">
              <SIPCalculator />
            </div>
          </TabsContent>
          <TabsContent value="emi">
            <div className="card-surface elevation-1 p-4 sm:p-6">
              <EMICalculator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

