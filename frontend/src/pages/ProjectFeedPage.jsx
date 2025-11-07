import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard.jsx';
import { fetchProjects } from '../services/projectService.js';
import { useAuth } from '../hooks/useAuth.js';

const defaultFilters = {
  difficulty: '',
  projectType: '',
  zip: ''
};

const ProjectFeedPage = () => {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  const loadProjects = async (activeFilters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProjects(activeFilters, token);
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleChange = (e) => {
    const nextFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(nextFilters);
  };

  const handleApplyFilters = () => {
    loadProjects(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadProjects({});
  };

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">Find a Project</h2>
        <p className="text-gray-600">Filter by difficulty, type, or location to find your next build.</p>
      </header>

      <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4">
        <label className="flex flex-col text-sm">
          Difficulty
          <select name="difficulty" value={filters.difficulty} onChange={handleChange} className="border rounded p-2">
            <option value="">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Project Type
          <select name="projectType" value={filters.projectType} onChange={handleChange} className="border rounded p-2">
            <option value="">Any</option>
            <option value="repair">Repair</option>
            <option value="install">Install</option>
            <option value="garden">Garden</option>
            <option value="build">Build</option>
            <option value="restore">Restore</option>
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Zip
          <input
            type="text"
            name="zip"
            value={filters.zip}
            onChange={handleChange}
            className="border rounded p-2"
            placeholder="90210"
          />
        </label>
        <div className="flex items-end gap-2">
          <button onClick={handleApplyFilters} className="px-4 py-2 border rounded">
            Apply
          </button>
          <button onClick={handleReset} className="px-4 py-2 border rounded">
            Reset
          </button>
        </div>
      </div>

      {isLoading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
        {!isLoading && !projects.length && <p>No projects available yet.</p>}
      </div>
    </section>
  );
};

export default ProjectFeedPage;

