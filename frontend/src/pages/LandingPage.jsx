import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-8 text-center flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Build Where You Live</h1>
      <p className="text-gray-600">
        Connect with skilled makers and community organizations to complete high-impact build and repair
        projects in your neighborhood.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/projects" className="px-4 py-2 rounded border">
          Browse Projects
        </Link>
        <Link to="/auth/register" className="px-4 py-2 rounded border">
          Join the Network
        </Link>
      </div>
    </section>
  );
};

export default LandingPage;

