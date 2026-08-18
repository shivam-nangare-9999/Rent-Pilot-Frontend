import React, { useState, useEffect } from 'react';
import { Zap, Calculator, CheckCircle2 } from 'lucide-react';

export default function ElectricityCalculator({ onAddBill }) {
  const [prevReading, setPrevReading] = useState('');
  const [currReading, setCurrReading] = useState('');
  const [rate, setRate] = useState(10); // डिफॉल्ट रेट १० रुपये
  const [bill, setBill] = useState(0);
  const [units, setUnits] = useState(0);

  useEffect(() => {
    if (currReading > prevReading) {
      const u = Number(currReading) - Number(prevReading);
      setUnits(u);
      setBill(u * Number(rate));
    } else {
      setUnits(0);
      setBill(0);
    }
  }, [prevReading, currReading, rate]);

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-bold text-amber-900">Electricity Bill Calculator</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[10px] font-bold text-amber-800 uppercase">मागील रीडिंग</label>
          <input
            type="number"
            value={prevReading}
            onChange={(e) => setPrevReading(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-amber-500"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-amber-800 uppercase">चालू रीडिंग</label>
          <input
            type="number"
            value={currReading}
            onChange={(e) => setCurrReading(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-amber-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-[10px] font-bold text-amber-800 uppercase">दर (₹/Unit)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm focus:outline-amber-500"
          />
        </div>
        <div className="flex-1 text-right">
          <p className="text-[10px] text-amber-700 font-bold uppercase">एकूण बिल</p>
          <p className="text-xl font-black text-amber-900">₹{bill.toLocaleString()}</p>
        </div>
      </div>

      {bill > 0 && (
        <button
          onClick={() => onAddBill(bill)}
          className="w-full mt-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          हे बिल रेंटमध्ये जोडा (₹{bill})
        </button>
      )}
    </div>
  );
}