import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <p className="text-sm text-gray-600 max-h-20 overflow-hidden">{project.description}</p>
      <div className="text-sm text-gray-500">
        <span>{project.location?.city}</span> · <span>{project.difficulty}</span>
      </div>
      <Link to={`/projects/${project._id}`} className="text-blue-600 text-sm underline">
        View project
      </Link>
    </div>
  );
};

export default ProjectCard;

