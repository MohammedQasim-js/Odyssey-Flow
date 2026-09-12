import React, { useState } from 'react';
import { 
  ChevronLeft, Calendar, ShieldCheck, CheckCircle2, 
  ArrowRight, Building2, Lock, Receipt, Check, Download
} from 'lucide-react';
import { BookingData } from './AppointmentBookingView';
import { DataStore } from '../../services/dataStore';
import { Token } from '../../types';

interface ReviewAndPayViewProps {
  bookingData: BookingData;
  onBack: () => void;
  onPaymentSuccess: (token: Token) => void;
}

export const ReviewAndPayView: React.FC<ReviewAndPayViewProps> = ({
  bookingData,
  onBack,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    token: Token;
    receiptNumber: string;
    amount: number;
    date: string;
  } | null>(null);

  const [showingReceiptModal, setShowingReceiptModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleConfirmPay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Generate actual token in DataStore
      const token = DataStore.generateToken({
        patientId: bookingData.patient.id,
        clinicId: bookingData.clinic.id,
        doctorId: bookingData.doctor.id,
        symptomsSummary: bookingData.symptoms.join(', ') + (bookingData.notes ? ` - ${bookingData.notes}` : ''),
      });

      // Save appointment record
      DataStore.saveAppointment({
        id: `apt_${Date.now()}`,
        patientId: bookingData.patient.id,
        doctorId: bookingData.doctor.id,
        doctorName: bookingData.doctor.name,
        doctorSpecialty: bookingData.doctor.specialty,
        doctorAvatarUrl: bookingData.doctor.avatarUrl,
        clinicId: bookingData.clinic.id,
        clinicName: bookingData.clinic.name,
        clinicAddress: bookingData.clinic.address,
        date: bookingData.date,
        time: bookingData.time,
        type: bookingData.mode,
        status: 'upcoming',
        symptoms: bookingData.symptoms.join(', '),
        roomNumber: 'Room 101',
        fee: 800,
      });

      const receiptNumber = `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      setIsProcessing(false);
      setPaymentSuccessData({
        token,
        receiptNumber,
        amount: 800,
        date: `${bookingData.date}, ${bookingData.time}`,
      });
    }, 600);
  };

  // 1. PAYMENT SUCCESS VIEW (Exact Prompt Requirements)
  if (paymentSuccessData) {
    return (
      <div className="space-y-4 pb-28 font-sans text-stone-900 animate-in fade-in duration-200">
        <div className="pt-2 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mb-3 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Payment successful
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Your appointment has been confirmed &amp; synced.
          </p>
        </div>

        {/* Success Details Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-3.5">
          <div className="text-center pb-2 border-b border-stone-100">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Amount Paid</span>
            <span className="text-3xl font-extrabold text-stone-900 font-mono">₹{paymentSuccessData.amount}.00</span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-stone-100">
            <div className="pt-1 flex justify-between">
              <span className="text-stone-500">Date &amp; Time</span>
              <span className="font-semibold text-stone-900">{paymentSuccessData.date}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-stone-500">Clinic</span>
              <span className="font-semibold text-stone-900">{bookingData.clinic.name}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-stone-500">Doctor</span>
              <span className="font-semibold text-stone-900">{bookingData.doctor.name}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-stone-500">Receipt Number</span>
              <span className="font-mono font-bold text-stone-900">{paymentSuccessData.receiptNumber}</span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-stone-500">Token Number</span>
              <span className="font-mono font-bold text-[#16A34A]">{paymentSuccessData.token.tokenNumber}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: View Receipt & Done (Exact Specs) */}
        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => setShowingReceiptModal(true)}
            className="w-full py-3.5 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-800 font-bold text-xs transition-all flex items-center justify-center space-x-2"
          >
            <Receipt className="w-4 h-4 text-stone-500" />
            <span>View Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => onPaymentSuccess(paymentSuccessData.token)}
            className="w-full py-4 px-6 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
          >
            <span>Done</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Modal */}
        {showingReceiptModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">Official Receipt</span>
                  <h3 className="font-extrabold text-stone-900 text-base">{bookingData.clinic.name}</h3>
                </div>
                <button
                  onClick={() => setShowingReceiptModal(false)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs divide-y divide-stone-100">
                <div className="pt-1 flex justify-between">
                  <span className="text-stone-500">Patient</span>
                  <span className="font-bold text-stone-900">{bookingData.patient.fullName}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-stone-500">Doctor</span>
                  <span className="font-semibold text-stone-800">{bookingData.doctor.name}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-stone-500">Visit Date</span>
                  <span className="font-mono text-stone-800">{paymentSuccessData.date}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-stone-500">Token</span>
                  <span className="font-mono font-bold text-[#16A34A]">{paymentSuccessData.token.tokenNumber}</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-stone-500">Consultation Fee</span>
                  <span className="font-mono font-semibold text-stone-800">₹800.00</span>
                </div>
                <div className="pt-2 flex justify-between">
                  <span className="text-stone-500">Other charges</span>
                  <span className="font-mono font-semibold text-stone-800">₹100.00</span>
                </div>
                <div className="pt-2 flex justify-between text-[#16A34A]">
                  <span>Discount</span>
                  <span className="font-mono font-semibold">-₹100.00</span>
                </div>
                <div className="pt-3 flex justify-between font-extrabold text-sm text-stone-900 border-t-2 border-stone-200">
                  <span>Total</span>
                  <span className="font-mono text-[#16A34A]">₹800.00</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setDownloadSuccess(true);
                    setTimeout(() => setDownloadSuccess(false), 2000);
                  }}
                  className="w-full py-3 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold text-xs shadow-2xs flex items-center justify-center space-x-1.5"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Receipt Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowingReceiptModal(false)}
                  className="w-full py-2 bg-stone-100 text-stone-600 rounded-2xl text-xs font-semibold hover:bg-stone-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // 2. REVIEW & PAY VIEW (Exact Prompt Requirements)
  return (
    <div className="space-y-4 pb-28 font-sans text-stone-900 animate-in fade-in duration-200">
      
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center text-stone-700 hover:text-stone-900 active:scale-95 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-base font-extrabold text-stone-900">Review &amp; Pay</h2>

        <div className="w-10 h-10"></div>
      </div>

      {/* 2. Subtitle */}
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Review &amp; Pay
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Review your consultation details and complete simulated payment.
        </p>
      </div>

      {/* 3. Appointment Session Summary Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0 border border-emerald-100">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-stone-900">
              {bookingData.date} • {bookingData.time}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Consultation with <strong className="text-stone-900">{bookingData.doctor.name}</strong>
            </p>
            <p className="text-[11px] text-stone-400 mt-1 flex items-center space-x-1">
              <Building2 className="w-3 h-3" />
              <span>{bookingData.clinic.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 4. Cost Breakdown Card (Consultation fee, Service fee, Discount, Total) */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
          Cost Breakdown
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Consultation fee</span>
            <span className="font-semibold text-stone-900">₹800.00</span>
          </div>

          <div className="flex justify-between text-stone-600">
            <span>Service fee</span>
            <span className="font-semibold text-stone-900">₹100.00</span>
          </div>

          <div className="flex justify-between text-[#16A34A] font-medium">
            <span>Discount</span>
            <span>-₹100.00</span>
          </div>

          <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
            <span className="text-sm font-extrabold text-stone-900">Total</span>
            <span className="text-2xl font-extrabold text-stone-900 font-mono">₹800.00</span>
          </div>
        </div>
      </div>

      {/* 5. Payment Method Selector (Card / UPI Simulated) */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-stone-900 block">Payment Method</span>

        {/* Card Option */}
        <div 
          onClick={() => setPaymentMethod('card')}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer flex items-center justify-between ${
            paymentMethod === 'card'
              ? 'border-[#16A34A] shadow-xs ring-1 ring-[#16A34A]'
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white text-[10px] font-bold tracking-wider font-mono">
              MC
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">Credit / Debit Card</span>
              <span className="text-[11px] text-stone-500 font-mono">•••• 0123 (Simulated)</span>
            </div>
          </div>

          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            paymentMethod === 'card'
              ? 'border-[#16A34A] bg-[#16A34A] text-white'
              : 'border-stone-300'
          }`}>
            {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>

        {/* UPI Option */}
        <div 
          onClick={() => setPaymentMethod('upi')}
          className={`p-4 rounded-2xl bg-white border transition-all cursor-pointer flex items-center justify-between ${
            paymentMethod === 'upi'
              ? 'border-[#16A34A] shadow-xs ring-1 ring-[#16A34A]'
              : 'border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white text-[10px] font-bold">
              UPI
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 block">UPI Instant Pay</span>
              <span className="text-[11px] text-stone-500">Google Pay, PhonePe, Paytm (Simulated)</span>
            </div>
          </div>

          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
            paymentMethod === 'upi'
              ? 'border-[#16A34A] bg-[#16A34A] text-white'
              : 'border-stone-300'
          }`}>
            {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
        </div>
      </div>

      {/* 6. Security Note */}
      <div className="p-3.5 rounded-2xl bg-stone-100 border border-stone-200/60 text-[11px] text-stone-500 flex items-center space-x-2">
        <Lock className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
        <span>Simulated prototype payment. No real banking credentials processed.</span>
      </div>

      {/* 7. Confirm & Pay Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleConfirmPay}
          className="w-full py-4 px-6 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center space-x-2"
        >
          <span>{isProcessing ? 'Processing Payment...' : 'Pay ₹800.00'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
