// Dummy data for testing - 10 appointments with various statuses and dates
export const dummyAppointments = [
  {
    id: 1,
    title: "Academic Advising Session",
    start: "2025-01-15T10:00:00Z",
    end: "2025-01-15T11:00:00Z",
    consultation_date: "2025-01-15T10:00:00Z",
    service_type: "Academic Consultation",
    office_name: "Guidance and Counseling",
    concern_description: "Need guidance on course selection for next semester and career planning discussion.",
    group_members: "",
    status: "pending",
    reference_code: "GC-2025-001",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Dr. Maria Santos",
    created_at: "2025-01-10T08:00:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "Guidance and Counseling",
      office_name: "Guidance and Counseling", 
      service_type: "Academic Consultation",
      service: "Academic Consultation",
      status: "pending",
      concern_description: "Need guidance on course selection for next semester and career planning discussion.",
      staff: "Dr. Maria Santos",
      reference_code: "GC-2025-001",
      attachment: null
    }
  },
  {
    id: 2,
    title: "Career Planning Meeting",
    start: "2025-01-16T14:30:00Z", 
    end: "2025-01-16T15:30:00Z",
    consultation_date: "2025-01-16T14:30:00Z",
    service_type: "Career Guidance",
    office_name: "Student Affairs",
    concern_description: "Seeking advice on internship opportunities and job market trends in my field.",
    group_members: "Sarah Johnson, Mike Chen",
    status: "approved",
    reference_code: "SA-2025-002",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Prof. John Rivera",
    created_at: "2025-01-11T09:15:00Z",
    details: {
      student: "You",
      studentName: "You", 
      office: "Student Affairs",
      office_name: "Student Affairs",
      service_type: "Career Guidance",
      service: "Career Guidance",
      status: "approved",
      concern_description: "Seeking advice on internship opportunities and job market trends in my field.",
      staff: "Prof. John Rivera",
      reference_code: "SA-2025-002",
      attachment: null
    }
  },
  {
    id: 3,
    title: "IT Support Request",
    start: "2025-01-18T11:15:00Z",
    end: "2025-01-18T12:15:00Z", 
    consultation_date: "2025-01-18T11:15:00Z",
    service_type: "Technical Support",
    office_name: "IT Services",
    concern_description: "Having issues with student portal access and need help with email configuration.",
    group_members: "",
    status: "declined",
    reference_code: "IT-2025-003",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Tech. Alex Cruz",
    created_at: "2025-01-12T10:30:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "IT Services", 
      office_name: "IT Services",
      service_type: "Technical Support",
      service: "Technical Support",
      status: "declined",
      concern_description: "Having issues with student portal access and need help with email configuration.",
      staff: "Tech. Alex Cruz",
      reference_code: "IT-2025-003",
      attachment: null
    }
  },
  {
    id: 4,
    title: "Financial Aid Consultation",
    start: "2025-01-20T09:00:00Z",
    end: "2025-01-20T10:00:00Z",
    consultation_date: "2025-01-20T09:00:00Z", 
    service_type: "Financial Consultation",
    office_name: "Financial Aid Office",
    concern_description: "Questions about scholarship applications and student loan options for next academic year.",
    group_members: "",
    status: "pending",
    reference_code: "FA-2025-004",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Ms. Linda Garcia",
    created_at: "2025-01-13T14:20:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "Financial Aid Office",
      office_name: "Financial Aid Office",
      service_type: "Financial Consultation", 
      service: "Financial Consultation",
      status: "pending",
      concern_description: "Questions about scholarship applications and student loan options for next academic year.",
      staff: "Ms. Linda Garcia",
      reference_code: "FA-2025-004",
      attachment: null
    }
  },
  {
    id: 5,
    title: "Health and Wellness Check",
    start: "2025-01-22T13:00:00Z",
    end: "2025-01-22T14:00:00Z",
    consultation_date: "2025-01-22T13:00:00Z",
    service_type: "Health Consultation",
    office_name: "Health Services", 
    concern_description: "Routine health checkup and discussion about mental health resources available on campus.",
    group_members: "",
    status: "approved",
    reference_code: "HS-2025-005",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Dr. Patricia Lim",
    created_at: "2025-01-14T11:45:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "Health Services",
      office_name: "Health Services",
      service_type: "Health Consultation",
      service: "Health Consultation", 
      status: "approved",
      concern_description: "Routine health checkup and discussion about mental health resources available on campus.",
      staff: "Dr. Patricia Lim",
      reference_code: "HS-2025-005",
      attachment: null
    }
  },
  {
    id: 6,
    title: "Registration Assistance",
    start: "2025-01-25T10:30:00Z",
    end: "2025-01-25T11:30:00Z",
    consultation_date: "2025-01-25T10:30:00Z",
    service_type: "Registration Support", 
    office_name: "Registrar's Office",
    concern_description: "Need help with course registration for the upcoming semester and transcript requests.",
    group_members: "Emma Rodriguez",
    status: "pending",
    reference_code: "RO-2025-006",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Ms. Carol Tan",
    created_at: "2025-01-15T08:30:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "Registrar's Office",
      office_name: "Registrar's Office",
      service_type: "Registration Support",
      service: "Registration Support",
      status: "pending",
      concern_description: "Need help with course registration for the upcoming semester and transcript requests.",
      staff: "Ms. Carol Tan",
      reference_code: "RO-2025-006", 
      attachment: null
    }
  },
  {
    id: 7,
    title: "Library Research Session",
    start: "2025-01-28T15:00:00Z",
    end: "2025-01-28T16:00:00Z",
    consultation_date: "2025-01-28T15:00:00Z",
    service_type: "Academic Support",
    office_name: "Library Services",
    concern_description: "Need assistance with research methodology and accessing academic databases for thesis project.",
    group_members: "Kevin Park, Lisa Wong",
    status: "approved", 
    reference_code: "LS-2025-007",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Librarian James Lee",
    created_at: "2025-01-16T12:00:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "Library Services",
      office_name: "Library Services",
      service_type: "Academic Support",
      service: "Academic Support",
      status: "approved",
      concern_description: "Need assistance with research methodology and accessing academic databases for thesis project.",
      staff: "Librarian James Lee",
      reference_code: "LS-2025-007",
      attachment: null
    }
  },
  {
    id: 8,
    title: "Student Organization Meeting",
    start: "2025-01-30T16:30:00Z",
    end: "2025-01-30T17:30:00Z",
    consultation_date: "2025-01-30T16:30:00Z",
    service_type: "Organizational Consultation",
    office_name: "Student Activities",
    concern_description: "Discussion about forming a new student organization and understanding the registration process.",
    group_members: "David Kim, Rachel Smith, Tony Martinez",
    status: "declined",
    reference_code: "SAC-2025-008",
    uploaded_file_url: null,
    student_name: "You", 
    staff_assigned: "Mr. Robert Wilson",
    created_at: "2025-01-17T13:15:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "Student Activities",
      office_name: "Student Activities",
      service_type: "Organizational Consultation",
      service: "Organizational Consultation",
      status: "declined",
      concern_description: "Discussion about forming a new student organization and understanding the registration process.",
      staff: "Mr. Robert Wilson",
      reference_code: "SAC-2025-008",
      attachment: null
    }
  },
  {
    id: 9,
    title: "Psychology Consultation",
    start: "2025-02-02T11:00:00Z",
    end: "2025-02-02T12:00:00Z",
    consultation_date: "2025-02-02T11:00:00Z",
    service_type: "Counseling Session",
    office_name: "Counseling Center",
    concern_description: "Seeking support for academic stress management and time management strategies.",
    group_members: "",
    status: "pending",
    reference_code: "CC-2025-009",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Dr. Susan Martinez",
    created_at: "2025-01-18T09:45:00Z",
    details: {
      student: "You",
      studentName: "You",
      office: "Counseling Center",
      office_name: "Counseling Center",
      service_type: "Counseling Session",
      service: "Counseling Session", 
      status: "pending",
      concern_description: "Seeking support for academic stress management and time management strategies.",
      staff: "Dr. Susan Martinez",
      reference_code: "CC-2025-009",
      attachment: null
    }
  },
  {
    id: 10,
    title: "Graduation Requirements Review",
    start: "2025-02-05T14:00:00Z",
    end: "2025-02-05T15:00:00Z",
    consultation_date: "2025-02-05T14:00:00Z",
    service_type: "Academic Planning",
    office_name: "Academic Affairs",
    concern_description: "Review of graduation requirements and discussion of remaining coursework needed for degree completion.",
    group_members: "",
    status: "approved",
    reference_code: "AA-2025-010",
    uploaded_file_url: null,
    student_name: "You",
    staff_assigned: "Dr. Michael Brown",
    created_at: "2025-01-19T10:00:00Z",
    details: {
      student: "You", 
      studentName: "You",
      office: "Academic Affairs",
      office_name: "Academic Affairs",
      service_type: "Academic Planning",
      service: "Academic Planning",
      status: "approved", 
      concern_description: "Review of graduation requirements and discussion of remaining coursework needed for degree completion.",
      staff: "Dr. Michael Brown",
      reference_code: "AA-2025-010",
      attachment: null
    }
  }
];

// Transform data for different components based on their needs
export const getCalendarAppointments = () => {
  return dummyAppointments.map(appt => ({
    ...appt,
    // Calendar expects this structure
    date: new Date(appt.start),
    dateString: new Date(appt.start).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: new Date(appt.start).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
  }));
};

export const getUpcomingAppointments = () => {
  // Filter for future appointments only
  const now = new Date();
  return dummyAppointments
    .filter(appt => new Date(appt.start) > now)
    .slice(0, 5) // Limit to 5 upcoming
    .map(appt => ({
      ...appt,
      dateString: new Date(appt.start).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: new Date(appt.start).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    }));
};

export const getBookedConsultations = () => {
  // Filter for pending and approved appointments
  return dummyAppointments
    .filter(appt => ['pending', 'approved'].includes(appt.status))
    .map(appt => ({
      ...appt,
      dateString: new Date(appt.consultation_date).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      time: new Date(appt.consultation_date).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
    }));
};

export const getBookingHistory = () => {
  // All appointments for history
  return dummyAppointments.map(appt => ({
    ...appt,
    dateString: new Date(appt.consultation_date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: new Date(appt.consultation_date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
  }));
};

// Office data for dropdowns
export const dummyOffices = [
  { id: 1, office_name: "Guidance and Counseling", description: "Academic and career guidance services" },
  { id: 2, office_name: "Student Affairs", description: "General student support and activities" },
  { id: 3, office_name: "IT Services", description: "Technical support and IT assistance" },
  { id: 4, office_name: "Financial Aid Office", description: "Financial assistance and scholarship services" },
  { id: 5, office_name: "Health Services", description: "Medical and wellness services" },
  { id: 6, office_name: "Registrar's Office", description: "Registration and academic records" },
  { id: 7, office_name: "Library Services", description: "Research and library assistance" },
  { id: 8, office_name: "Student Activities", description: "Extracurricular and organizational support" },
  { id: 9, office_name: "Counseling Center", description: "Mental health and counseling services" },
  { id: 10, office_name: "Academic Affairs", description: "Academic planning and requirements" }
];