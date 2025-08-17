"use client";

export default function Statistics() {
  return (
    <section className="py-16 px-4 bg-gradient-to-r from-slate-900 to-gray-900">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
              500+
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Projects Delivered
            </div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
              1000+
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Industry Experts
            </div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
              98.9%
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Client Satisfaction
            </div>
          </div>
          <div>
            <div className="text-3xl lg:text-4xl font-bold text-blue-400 mb-2 font-poppins">
              30+
            </div>
            <div className="text-sm text-gray-400 font-medium">
              Industry Awards
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
