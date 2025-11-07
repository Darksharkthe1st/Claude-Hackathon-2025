import { useEffect, useState } from 'react';
import { fetchProjects } from '../services/projectService.js';
import { useAuth } from '../hooks/useAuth.js';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProjects({}, token);
        setProjects(data);
      } catch (_error) {
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [token]);

  const myProjects = projects.filter((project) => {
    const postedById = project.postedBy?.id || project.postedBy?._id;
    const volunteerIds = (project.volunteers || []).map((volunteer) => volunteer.id || volunteer._id);
    return postedById === user?.id || volunteerIds.includes(user?.id);
  });

  return (
    <section className="flex flex-col gap-6">
      <header className="bg-white rounded-lg p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Welcome back, {user?.name}</h1>
        <p className="text-gray-600">Track the projects you&apos;re leading or volunteering on.</p>
      </header>

      <section className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">My Projects</h2>
        {isLoading && <p>Loading...</p>}
        {!isLoading && !myProjects.length && <p>You haven&apos;t joined any projects yet.</p>}
        <ul className="flex flex-col gap-3">
          {myProjects.map((project) => (
            <li key={project._id} className="border rounded p-3">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-500">Status: {project.status}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default DashboardPage;

