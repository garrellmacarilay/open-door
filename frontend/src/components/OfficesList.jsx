import './OfficesList.css';

function OfficesList() {
  const offices = [
    'Communications',
    'Guidance and Counseling',
    'Medical and Dental Services',
    'Sports Development and Management',
    'Student Assistance and Experimental Education',
    'Student Discipline',
    'Student Internship',
    'Student Organization',
    'Student IT Support and Services',
    'Student Publication'
  ];

  return (
    <div className="offices-container">
      <h3 className="offices-title">Offices | Unit</h3>
      <div className="offices-list">
        {offices.map((office, index) => (
          <div key={index} className="office-item">
            {office}
          </div>
        ))}
      </div>
      <button className="restrict-btn">
        Restrict
      </button>
    </div>
  );
}

export default OfficesList;
