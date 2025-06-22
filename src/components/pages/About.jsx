import { FaUniversity, FaGraduationCap, FaUsers, FaAward, FaGlobeAmericas, FaChartLine } from 'react-icons/fa';
import { MdDiversity3, MdScience } from 'react-icons/md';

export default function About() {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            About Akash University
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Excellence in education, research, and innovation since 1995
          </p>
        </div>

        {/* University Overview */}
        <div className="mb-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 1995, Akash University has grown from a small college to a nationally recognized institution of higher learning. Our commitment to academic excellence and student success has remained unwavering throughout our history.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Named after the Sanskrit word for "sky" or "space," Akash University represents our boundless aspirations for our students and our commitment to expanding the frontiers of knowledge.
              </p>
              <p className="text-lg text-gray-600">
                Today, we serve over 15,000 students across our undergraduate, graduate, and professional programs, with a faculty of more than 800 dedicated educators and researchers.
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-6 flex items-center justify-center">
              <img
                className="rounded-lg shadow-md"
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80"
                alt="Akash University campus"
              />
            </div>
          </div>
        </div>

        {/* Mission and Values */}
        <div className="mb-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaUniversity className="h-8 w-8 text-indigo-600" />,
                title: "Mission",
                description: "To provide transformative educational experiences that prepare students for meaningful careers and responsible citizenship in a global society."
              },
              {
                icon: <FaGraduationCap className="h-8 w-8 text-indigo-600" />,
                title: "Academic Excellence",
                description: "We maintain the highest standards of teaching, learning, and scholarship across all disciplines."
              },
              {
                icon: <MdDiversity3 className="h-8 w-8 text-indigo-600" />,
                title: "Diversity & Inclusion",
                description: "We foster an inclusive community that values and respects all individuals and perspectives."
              },
              {
                icon: <FaUsers className="h-8 w-8 text-indigo-600" />,
                title: "Student-Centered",
                description: "Every decision we make prioritizes the intellectual, personal, and professional growth of our students."
              },
              {
                icon: <MdScience className="h-8 w-8 text-indigo-600" />,
                title: "Innovation",
                description: "We embrace creativity and discovery to address the complex challenges of our time."
              },
              {
                icon: <FaGlobeAmericas className="h-8 w-8 text-indigo-600" />,
                title: "Global Engagement",
                description: "We prepare students to thrive in an interconnected world through international partnerships and perspectives."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">University Leadership</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Dr. Priya Sharma",
                title: "Chancellor",
                image: "https://randomuser.me/api/portraits/women/65.jpg",
                bio: "Visionary leader with 25+ years in higher education administration."
              },
              {
                name: "Dr. Raj Patel",
                title: "Vice Chancellor",
                image: "https://randomuser.me/api/portraits/men/42.jpg",
                bio: "Expert in academic innovation and strategic planning."
              },
              {
                name: "Dr. Ananya Gupta",
                title: "Provost",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                bio: "Champion of faculty development and research excellence."
              },
              {
                name: "Mr. Arjun Kapoor",
                title: "Dean of Students",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                bio: "Dedicated to student success and campus life enrichment."
              }
            ].map((leader, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  className="h-48 w-full object-cover"
                  src={leader.image}
                  alt={leader.name}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{leader.name}</h3>
                  <p className="text-indigo-600">{leader.title}</p>
                  <p className="mt-2 text-gray-600 text-sm">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats and Achievements */}
        <div className="bg-indigo-700 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              {
                icon: <FaGraduationCap className="h-8 w-8 mx-auto mb-2" />,
                number: "15,000+",
                label: "Students"
              },
              {
                icon: <FaUsers className="h-8 w-8 mx-auto mb-2" />,
                number: "800+",
                label: "Faculty"
              },
              {
                icon: <FaAward className="h-8 w-8 mx-auto mb-2" />,
                number: "75+",
                label: "Programs"
              },
              {
                icon: <FaChartLine className="h-8 w-8 mx-auto mb-2" />,
                number: "95%",
                label: "Graduation Employment Rate"
              }
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <div className="flex justify-center">{stat.icon}</div>
                <p className="text-3xl font-bold">{stat.number}</p>
                <p className="text-indigo-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Accreditation */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Accreditation & Recognition</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accreditation</h3>
              <p className="text-gray-600 mb-4">
                Akash University is fully accredited by the National Assessment and Accreditation Council (NAAC) with an 'A++' grade, the highest possible rating.
              </p>
              <p className="text-gray-600">
                Our professional programs hold additional accreditation from their respective national and international bodies.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Awards & Rankings</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Ranked among the top 50 universities nationally by Education World</li>
                <li>Recipient of the Excellence in Innovation Award (2022)</li>
                <li>Recognized for Best Campus Infrastructure (2023)</li>
                <li>Top 10 in Student Satisfaction Surveys for 5 consecutive years</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}