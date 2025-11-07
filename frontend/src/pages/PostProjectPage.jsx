import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/projectService.js';
import { useAuth } from '../hooks/useAuth.js';

const initialState = {
  title: '',
  description: '',
  city: '',
  zip: '',
  difficulty: 'easy',
  toolsRequired: '',
  projectType: 'build'
};

const PostProjectPage = () => {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createProject(
        {
          title: form.title,
          description: form.description,
          difficulty: form.difficulty,
          projectType: form.projectType,
          toolsRequired: form.toolsRequired.split(',').map((tool) => tool.trim()).filter(Boolean),
          location: { city: form.city, zip: form.zip }
        },
        token
      );
      navigate('/projects');
    } catch (_error) {
      setError('Failed to post project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Post a Community Project</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span>Title</span>
          <input name="title" value={form.title} onChange={handleChange} required className="border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={4}
            className="border rounded px-3 py-2"
          />
        </label>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span>City</span>
            <input name="city" value={form.city} onChange={handleChange} required className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1">
            <span>Zip</span>
            <input name="zip" value={form.zip} onChange={handleChange} required className="border rounded px-3 py-2" />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <span>Difficulty</span>
          <select name="difficulty" value={form.difficulty} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>Project Type</span>
          <select name="projectType" value={form.projectType} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="repair">Repair</option>
            <option value="install">Install</option>
            <option value="garden">Garden</option>
            <option value="build">Build</option>
            <option value="restore">Restore</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>Required Tools (comma separated)</span>
          <input
            name="toolsRequired"
            value={form.toolsRequired}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Drill, Ladder, Saw"
          />
        </label>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 border rounded">
          {isSubmitting ? 'Posting...' : 'Post Project'}
        </button>
      </form>
    </section>
  );
};

export default PostProjectPage;

