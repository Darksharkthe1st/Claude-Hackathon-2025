import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const initialForm = {
  name: '',
  email: '',
  password: '',
  userType: 'volunteer',
  city: '',
  zip: '',
  skills: '',
  toolsOwned: ''
};

const RegisterPage = () => {
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        userType: form.userType,
        location: { city: form.city, zip: form.zip },
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
        toolsOwned: form.toolsOwned.split(',').map((tool) => tool.trim()).filter(Boolean)
      });
    } catch (_error) {
      setError('Unable to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Join Wrench</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span>Name</span>
          <input name="name" value={form.name} onChange={handleChange} required className="border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>User Type</span>
          <select name="userType" value={form.userType} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="community">Community Organizer</option>
            <option value="volunteer">Volunteer Builder</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span>City</span>
          <input name="city" value={form.city} onChange={handleChange} required className="border rounded px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1">
          <span>Zip</span>
          <input name="zip" value={form.zip} onChange={handleChange} required className="border rounded px-3 py-2" />
        </label>
        <label className="md:col-span-2 flex flex-col gap-1">
          <span>Skills (comma separated)</span>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Carpentry, Painting"
          />
        </label>
        <label className="md:col-span-2 flex flex-col gap-1">
          <span>Tools Owned (comma separated)</span>
          <input
            name="toolsOwned"
            value={form.toolsOwned}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            placeholder="Drill, Saw, Hammer"
          />
        </label>
        <button type="submit" disabled={isSubmitting} className="px-4 py-2 border rounded">
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Already have an account? <Link to="/auth/login" className="underline">Login here</Link>.
      </p>
    </section>
  );
};

export default RegisterPage;

