const API_URL = '/api';
let currentUser = null;
let authToken = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check for stored auth token
    authToken = localStorage.getItem('authToken');
    if (authToken) {
        loadCurrentUser();
    }

    showHome();
});

// Auth functions
async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password')
            })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            updateAuthUI();
            showAlert('Login successful!', 'success');
            showDashboard();
        } else {
            showAlert(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showAlert('Login failed. Please try again.', 'error');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
                name: formData.get('name'),
                userType: formData.get('userType'),
                phone: formData.get('phone'),
                location: formData.get('location'),
                bio: formData.get('bio'),
                skills: formData.get('skills')
            })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            updateAuthUI();
            showAlert('Registration successful!', 'success');
            showDashboard();
        } else {
            showAlert(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showAlert('Registration failed. Please try again.', 'error');
    }
}

async function loadCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            currentUser = await response.json();
            updateAuthUI();
        } else {
            logout();
        }
    } catch (error) {
        console.error('Failed to load user:', error);
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
    showAlert('Logged out successfully', 'info');
    showHome();
}

function updateAuthUI() {
    const authLinks = document.getElementById('authLinks');
    const userLinks = document.getElementById('userLinks');

    if (currentUser) {
        authLinks.style.display = 'none';
        userLinks.style.display = 'flex';
    } else {
        authLinks.style.display = 'flex';
        userLinks.style.display = 'none';
    }
}

// Navigation functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';
}

function showHome() {
    showPage('homePage');
}

function showProjects() {
    showPage('projectsPage');
    loadProjects();

    const createBtn = document.getElementById('createProjectBtn');
    if (currentUser && currentUser.userType === 'community') {
        createBtn.innerHTML = '<button onclick="showCreateProjectModal()" class="btn-primary">Create Project</button>';
    } else {
        createBtn.innerHTML = '';
    }
}

function showEngineers() {
    showPage('engineersPage');
    loadEngineers();
}

function showLogin() {
    showPage('loginPage');
}

function showRegister(userType = '') {
    showPage('registerPage');
    const form = document.getElementById('registerForm');
    if (userType) {
        form.elements.userType.value = userType;
        toggleSkillsField(userType);
    }
}

function showDashboard() {
    if (!currentUser) {
        showLogin();
        return;
    }
    showPage('dashboardPage');
    loadDashboard();
}

function showProfile() {
    if (!currentUser) {
        showLogin();
        return;
    }
    showPage('profilePage');
    loadProfile();
}

// Projects
async function loadProjects() {
    try {
        const location = document.getElementById('searchLocation')?.value || '';
        const skills = document.getElementById('searchSkills')?.value || '';
        const category = document.getElementById('filterCategory')?.value || '';

        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (skills) params.append('skills', skills);
        if (category) params.append('category', category);

        const response = await fetch(`${API_URL}/projects?${params}`);
        const data = await response.json();

        displayProjects(data.projects);
    } catch (error) {
        showAlert('Failed to load projects', 'error');
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projectsList');

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects found.</p>';
        return;
    }

    container.innerHTML = projects.map(project => `
        <div class="project-card" onclick="showProjectDetails('${project.id}')">
            <div class="project-header">
                <div>
                    <div class="project-title">${escapeHtml(project.title)}</div>
                    <div style="color: #6b7280; font-size: 0.875rem;">${escapeHtml(project.community_name)}</div>
                </div>
                <span class="project-status status-${project.status}">${project.status.replace('_', ' ')}</span>
            </div>
            <div class="project-meta">
                <div>📍 ${escapeHtml(project.location)}</div>
                <div>🏷️ ${escapeHtml(project.category)}</div>
                ${project.budget_min && project.budget_max ? `<div>💰 $${project.budget_min} - $${project.budget_max}</div>` : ''}
                ${project.timeline ? `<div>⏱️ ${escapeHtml(project.timeline)}</div>` : ''}
            </div>
            <div class="project-description">${escapeHtml(project.description)}</div>
            <div class="project-footer">
                <div style="font-size: 0.875rem; color: #6b7280;">${project.bidCount} bid(s)</div>
                <div style="font-size: 0.875rem; color: #6b7280;">Posted ${formatDate(project.created_at)}</div>
            </div>
        </div>
    `).join('');
}

async function showProjectDetails(projectId) {
    try {
        const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
        const response = await fetch(`${API_URL}/projects/${projectId}`, { headers });
        const data = await response.json();
        const project = data.project;

        // Load bids if user owns the project
        let bidsHtml = '';
        if (currentUser && currentUser.userType === 'community' && project.community_id === currentUser.id) {
            const bidsResponse = await fetch(`${API_URL}/bids/project/${projectId}`, { headers });
            const bidsData = await bidsResponse.json();
            bidsHtml = `
                <h4 style="margin-top: 2rem;">Bids (${bidsData.bids.length})</h4>
                ${displayBids(bidsData.bids)}
            `;
        }

        // Show bid button for engineers
        let bidButtonHtml = '';
        if (currentUser && currentUser.userType === 'engineer' && project.status === 'open') {
            bidButtonHtml = `<button onclick="showBidModal('${projectId}')" class="btn-primary">Submit Bid</button>`;
        }

        showModal(`
            <div class="modal-header">
                <h3>${escapeHtml(project.title)}</h3>
                <button onclick="closeModal()" class="close-btn">&times;</button>
            </div>
            <div>
                <p style="color: #6b7280; margin-bottom: 1rem;">Posted by ${escapeHtml(project.community_name)}</p>
                <div style="margin-bottom: 1rem;">
                    <span class="project-status status-${project.status}">${project.status.replace('_', ' ')}</span>
                </div>
                <div class="project-meta" style="margin-bottom: 1rem;">
                    <div>📍 ${escapeHtml(project.location)}</div>
                    <div>🏷️ ${escapeHtml(project.category)}</div>
                    ${project.budget_min && project.budget_max ? `<div>💰 $${project.budget_min} - $${project.budget_max}</div>` : ''}
                    ${project.timeline ? `<div>⏱️ ${escapeHtml(project.timeline)}</div>` : ''}
                    ${project.required_skills ? `<div>🔧 Required: ${escapeHtml(project.required_skills)}</div>` : ''}
                </div>
                <h4>Description</h4>
                <p style="margin-bottom: 1.5rem;">${escapeHtml(project.description)}</p>
                ${bidButtonHtml}
                ${bidsHtml}
            </div>
        `);
    } catch (error) {
        showAlert('Failed to load project details', 'error');
    }
}

function showCreateProjectModal() {
    showModal(`
        <div class="modal-header">
            <h3>Create New Project</h3>
            <button onclick="closeModal()" class="close-btn">&times;</button>
        </div>
        <form onsubmit="handleCreateProject(event)">
            <div class="form-group">
                <label>Project Title</label>
                <input type="text" name="title" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="4" required></textarea>
            </div>
            <div class="form-group">
                <label>Category</label>
                <select name="category" required>
                    <option value="Construction">Construction</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Landscaping">Landscaping</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" name="location" required>
            </div>
            <div class="form-group">
                <label>Required Skills (optional)</label>
                <input type="text" name="requiredSkills" placeholder="e.g., Carpentry, Plumbing">
            </div>
            <div class="form-group">
                <label>Budget Range (optional)</label>
                <div style="display: flex; gap: 1rem;">
                    <input type="number" name="budgetMin" placeholder="Min" min="0">
                    <input type="number" name="budgetMax" placeholder="Max" min="0">
                </div>
            </div>
            <div class="form-group">
                <label>Timeline (optional)</label>
                <input type="text" name="timeline" placeholder="e.g., 2 weekends">
            </div>
            <button type="submit" class="btn-primary btn-full">Create Project</button>
        </form>
    `);
}

async function handleCreateProject(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                location: formData.get('location'),
                requiredSkills: formData.get('requiredSkills'),
                budgetMin: formData.get('budgetMin') ? parseFloat(formData.get('budgetMin')) : null,
                budgetMax: formData.get('budgetMax') ? parseFloat(formData.get('budgetMax')) : null,
                timeline: formData.get('timeline')
            })
        });

        if (response.ok) {
            closeModal();
            showAlert('Project created successfully!', 'success');
            loadProjects();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Failed to create project', 'error');
        }
    } catch (error) {
        showAlert('Failed to create project', 'error');
    }
}

// Bids
function showBidModal(projectId) {
    showModal(`
        <div class="modal-header">
            <h3>Submit Your Bid</h3>
            <button onclick="closeModal()" class="close-btn">&times;</button>
        </div>
        <form onsubmit="handleSubmitBid(event, '${projectId}')">
            <div class="form-group">
                <label>Proposed Budget ($)</label>
                <input type="number" name="proposedBudget" required min="0" step="0.01">
            </div>
            <div class="form-group">
                <label>Proposed Timeline</label>
                <input type="text" name="proposedTimeline" required placeholder="e.g., 2 weekends">
            </div>
            <div class="form-group">
                <label>Message (optional)</label>
                <textarea name="message" rows="4" placeholder="Introduce yourself and explain your approach..."></textarea>
            </div>
            <button type="submit" class="btn-primary btn-full">Submit Bid</button>
        </form>
    `);
}

async function handleSubmitBid(event, projectId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(`${API_URL}/bids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                projectId,
                proposedBudget: parseFloat(formData.get('proposedBudget')),
                proposedTimeline: formData.get('proposedTimeline'),
                message: formData.get('message')
            })
        });

        if (response.ok) {
            closeModal();
            showAlert('Bid submitted successfully!', 'success');
            showProjectDetails(projectId);
        } else {
            const data = await response.json();
            showAlert(data.error || 'Failed to submit bid', 'error');
        }
    } catch (error) {
        showAlert('Failed to submit bid', 'error');
    }
}

function displayBids(bids) {
    if (bids.length === 0) {
        return '<p style="color: #6b7280;">No bids yet.</p>';
    }

    return `
        <div class="bid-list">
            ${bids.map(bid => `
                <div class="bid-card">
                    <div class="bid-header">
                        <strong>${escapeHtml(bid.engineer_name)}</strong>
                        <span class="project-status status-${bid.status}">${bid.status}</span>
                    </div>
                    <div style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">
                        <div>📍 ${escapeHtml(bid.engineer_location)}</div>
                        <div>🔧 ${escapeHtml(bid.engineer_skills || 'N/A')}</div>
                        <div>💰 Budget: $${bid.proposed_budget}</div>
                        <div>⏱️ Timeline: ${escapeHtml(bid.proposed_timeline)}</div>
                    </div>
                    ${bid.message ? `<p style="margin: 0.5rem 0;">${escapeHtml(bid.message)}</p>` : ''}
                    ${bid.status === 'pending' ? `
                        <div class="bid-actions">
                            <button onclick="handleBidAction('${bid.id}', 'accepted')" class="btn-primary" style="padding: 0.5rem 1rem;">Accept</button>
                            <button onclick="handleBidAction('${bid.id}', 'rejected')" class="btn-secondary" style="padding: 0.5rem 1rem;">Reject</button>
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

async function handleBidAction(bidId, action) {
    try {
        const response = await fetch(`${API_URL}/bids/${bidId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ status: action })
        });

        if (response.ok) {
            showAlert(`Bid ${action} successfully!`, 'success');
            closeModal();
            loadDashboard();
        } else {
            const data = await response.json();
            showAlert(data.error || 'Action failed', 'error');
        }
    } catch (error) {
        showAlert('Action failed', 'error');
    }
}

// Engineers
async function loadEngineers() {
    try {
        const location = document.getElementById('searchEngineerLocation')?.value || '';
        const skills = document.getElementById('searchEngineerSkills')?.value || '';

        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (skills) params.append('skills', skills);

        const response = await fetch(`${API_URL}/engineers?${params}`);
        const data = await response.json();

        displayEngineers(data.engineers);
    } catch (error) {
        showAlert('Failed to load engineers', 'error');
    }
}

function displayEngineers(engineers) {
    const container = document.getElementById('engineersList');

    if (engineers.length === 0) {
        container.innerHTML = '<p>No engineers found.</p>';
        return;
    }

    container.innerHTML = engineers.map(engineer => `
        <div class="engineer-card">
            <div class="engineer-name">${escapeHtml(engineer.name)}</div>
            <div style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">📍 ${escapeHtml(engineer.location)}</div>
            ${engineer.bio ? `<p style="margin: 0.5rem 0;">${escapeHtml(engineer.bio)}</p>` : ''}
            ${engineer.skills ? `
                <div class="engineer-skills">
                    ${engineer.skills.split(',').map(skill => `<span class="skill-tag">${escapeHtml(skill.trim())}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Dashboard
async function loadDashboard() {
    const container = document.getElementById('dashboardContent');

    if (!currentUser) return;

    try {
        if (currentUser.userType === 'community') {
            // Load community dashboard
            const projectsResponse = await fetch(`${API_URL}/projects/my/projects`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const projectsData = await projectsResponse.json();

            container.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${projectsData.projects.length}</div>
                        <div class="stat-label">Total Projects</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${projectsData.projects.filter(p => p.status === 'open').length}</div>
                        <div class="stat-label">Open Projects</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${projectsData.projects.reduce((sum, p) => sum + p.bidCount, 0)}</div>
                        <div class="stat-label">Total Bids</div>
                    </div>
                </div>
                <h3>My Projects</h3>
                <div class="projects-grid">
                    ${projectsData.projects.map(project => `
                        <div class="project-card" onclick="showProjectDetails('${project.id}')">
                            <div class="project-header">
                                <div class="project-title">${escapeHtml(project.title)}</div>
                                <span class="project-status status-${project.status}">${project.status.replace('_', ' ')}</span>
                            </div>
                            <div class="project-footer">
                                <div>${project.bidCount} bid(s)</div>
                                <div>${formatDate(project.created_at)}</div>
                            </div>
                        </div>
                    `).join('') || '<p>No projects yet.</p>'}
                </div>
            `;
        } else {
            // Load engineer dashboard
            const bidsResponse = await fetch(`${API_URL}/bids/my/bids`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const bidsData = await bidsResponse.json();

            container.innerHTML = `
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${bidsData.bids.length}</div>
                        <div class="stat-label">Total Bids</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${bidsData.bids.filter(b => b.status === 'accepted').length}</div>
                        <div class="stat-label">Accepted Bids</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${bidsData.bids.filter(b => b.status === 'pending').length}</div>
                        <div class="stat-label">Pending Bids</div>
                    </div>
                </div>
                <h3>My Bids</h3>
                <div class="bid-list">
                    ${bidsData.bids.map(bid => `
                        <div class="bid-card">
                            <div class="bid-header">
                                <strong>${escapeHtml(bid.project_title)}</strong>
                                <span class="project-status status-${bid.status}">${bid.status}</span>
                            </div>
                            <div style="font-size: 0.875rem; color: #6b7280;">
                                <div>Community: ${escapeHtml(bid.community_name)}</div>
                                <div>💰 Your bid: $${bid.proposed_budget}</div>
                                <div>⏱️ Timeline: ${escapeHtml(bid.proposed_timeline)}</div>
                            </div>
                        </div>
                    `).join('') || '<p>No bids yet. Browse projects to get started!</p>'}
                </div>
            `;
        }
    } catch (error) {
        container.innerHTML = '<p>Failed to load dashboard</p>';
    }
}

// Profile
async function loadProfile() {
    const container = document.getElementById('profileContent');

    if (!currentUser) return;

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const user = await response.json();

        container.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 8px;">
                <h3>${escapeHtml(user.name)}</h3>
                <p style="color: #6b7280;">Account Type: ${user.userType === 'engineer' ? 'DIY Engineer' : 'Community Organization'}</p>
                <div style="margin-top: 1.5rem;">
                    <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(user.phone || 'N/A')}</p>
                    <p><strong>Location:</strong> ${escapeHtml(user.location)}</p>
                    ${user.bio ? `<p><strong>Bio:</strong> ${escapeHtml(user.bio)}</p>` : ''}
                    ${user.skills ? `<p><strong>Skills:</strong> ${escapeHtml(user.skills)}</p>` : ''}
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = '<p>Failed to load profile</p>';
    }
}

// Utility functions
function showModal(content) {
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('modalContainer').innerHTML = `<div class="modal">${content}</div>`;
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.getElementById('modalContainer').innerHTML = '';
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '80px';
    alertDiv.style.right = '20px';
    alertDiv.style.zIndex = '300';
    alertDiv.style.minWidth = '300px';

    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function toggleSkillsField(userType) {
    const skillsField = document.getElementById('skillsField');
    if (userType === 'engineer') {
        skillsField.style.display = 'block';
    } else {
        skillsField.style.display = 'none';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
}
