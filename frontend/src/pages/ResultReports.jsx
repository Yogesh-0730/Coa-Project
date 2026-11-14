import React, { useEffect, useState, useRef } from 'react';
import { FileText, Printer, Download, Search } from 'lucide-react';
import { getAllStudents, getReport } from '../api/studentApi';
import { useToast } from '../components/Toast';

export default function ResultReports() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const printRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    getAllStudents().then(res => setStudents(res.students)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId) { setReport(null); return; }
    setLoading(true);
    getReport(selectedId).then(setReport).catch(() => toast('Failed to load report', 'error')).finally(() => setLoading(false));
  }, [selectedId]);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Report Card - ${report.student.name}</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;color:#111}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{border:1px solid #333;padding:10px;text-align:center}th{background:#1a237e;color:white}.header{text-align:center;margin-bottom:24px}.header h1{font-size:22px;color:#1a237e}.header h2{font-size:16px;color:#333}.info{display:flex;justify-content:space-between;margin:16px 0}.grade{font-size:20px;font-weight:bold;text-align:center;margin:16px 0;padding:12px;background:#e8eaf6;border-radius:8px}.signatures{display:flex;justify-content:space-between;margin-top:60px;text-align:center}.signatures div{border-top:1px solid #333;padding-top:8px;width:150px}</style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const element = printRef.current;
      if (!element) return;
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, pageHeight - 20));
      pdf.save(`Report_${report.student.roll_number}.pdf`);
      toast('PDF downloaded successfully', 'success');
    } catch (e) {
      toast('Failed to generate PDF', 'error');
      console.error(e);
    }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.roll_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-electric-400" /> Result Reports
        </h1>
        <p className="text-gray-500 text-sm mt-1">Generate and download student report cards</p>
      </div>

      {/* Student Selector */}
      <div className="glass p-5">
        <label className="block text-sm font-medium text-gray-400 mb-2">Select Student</label>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search students..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-500/50" />
        </div>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-electric-500/50">
          <option value="">-- Choose a student --</option>
          {filtered.map(s => (
            <option key={s.id} value={s.id}>{s.roll_number} — {s.name} ({s.grade})</option>
          ))}
        </select>
      </div>

      {loading && <div className="glass p-20 text-center animate-pulse"><p className="text-gray-500">Loading report...</p></div>}

      {report && (
        <>
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-electric-500/20 text-electric-400 hover:bg-electric-500/30 border border-electric-500/20 transition">
              <Printer className="w-4 h-4" /> Print Report
            </button>
            <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/20 transition">
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          {/* Report Card */}
          <div ref={printRef} className="bg-white text-gray-900 rounded-xl p-8 print-area shadow-2xl">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-indigo-900">{report.institution.name}</h1>
              <p className="text-sm text-gray-600">{report.institution.address}</p>
              <h2 className="text-lg font-semibold mt-2 text-gray-800">{report.institution.exam}</h2>
              <p className="text-sm font-semibold mt-1 text-indigo-700">STUDENT ACADEMIC REPORT CARD</p>
            </div>

            {/* Student Info */}
            <div className="flex justify-between mb-6 text-sm">
              <div><span className="font-semibold">Name:</span> {report.student.name}</div>
              <div><span className="font-semibold">Roll No:</span> {report.student.roll_number}</div>
              <div><span className="font-semibold">Date:</span> {report.generated_at}</div>
            </div>

            {/* Marks Table */}
            <table className="w-full border-collapse border border-gray-400 mb-6 text-sm">
              <thead>
                <tr className="bg-indigo-900 text-white">
                  <th className="border border-gray-400 py-2.5 px-4 text-left">Subject</th>
                  <th className="border border-gray-400 py-2.5 px-4 text-center">Max Marks</th>
                  <th className="border border-gray-400 py-2.5 px-4 text-center">Marks Obtained</th>
                  <th className="border border-gray-400 py-2.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Mathematics', marks: report.student.mathematics },
                  { name: 'Computer Organization & Architecture', marks: report.student.coa },
                  { name: 'Programming', marks: report.student.programming },
                ].map(s => (
                  <tr key={s.name}>
                    <td className="border border-gray-400 py-2 px-4">{s.name}</td>
                    <td className="border border-gray-400 py-2 px-4 text-center">100</td>
                    <td className="border border-gray-400 py-2 px-4 text-center font-semibold">{s.marks}</td>
                    <td className={`border border-gray-400 py-2 px-4 text-center font-semibold ${s.marks >= 50 ? 'text-green-700' : 'text-red-700'}`}>
                      {s.marks >= 50 ? 'PASS' : 'FAIL'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-bold">
                  <td className="border border-gray-400 py-2 px-4">Total</td>
                  <td className="border border-gray-400 py-2 px-4 text-center">300</td>
                  <td className="border border-gray-400 py-2 px-4 text-center">{report.student.total}</td>
                  <td className="border border-gray-400 py-2 px-4 text-center">{report.student.average}%</td>
                </tr>
              </tbody>
            </table>

            {/* Grade & Result */}
            <div className="text-center py-4 bg-indigo-50 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Final Grade</p>
              <p className="text-2xl font-bold text-indigo-900">{report.student.grade}</p>
              <p className={`text-lg font-semibold mt-1 ${report.student.result === 'PASS' ? 'text-green-700' : 'text-red-700'}`}>
                {report.student.result}
              </p>
              <p className="text-sm text-gray-600 mt-1">{report.student.remarks}</p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-16 text-sm text-center">
              <div className="border-t border-gray-400 pt-2 w-36">
                <p className="font-semibold">Class Teacher</p>
              </div>
              <div className="border-t border-gray-400 pt-2 w-36">
                <p className="font-semibold">HOD</p>
              </div>
              <div className="border-t border-gray-400 pt-2 w-36">
                <p className="font-semibold">Principal</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
