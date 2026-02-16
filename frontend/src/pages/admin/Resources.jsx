import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import SEOHead from '../../components/common/SEOHead'
import Pagination from '../../components/common/Pagination'
import resourceService from '../../services/resourceService'
import { truncate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    title: '', description: '', category: '', tags: '', url: '', is_free: true,
  })

  const fetchResources = async () => {
    setLoading(true)
    try {
      const res = await resourceService.getAll({ page, limit: 20 })
      setResources(res.data.data || [])
      setTotalPages(res.data.pagination?.total_pages || 1)
    } catch {
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchResources() }, [page])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await resourceService.update(editing, form)
        toast.success('Resource updated!')
      } else {
        await resourceService.create(form)
        toast.success('Resource created!')
      }
      resetForm()
      fetchResources()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    }
  }

  const handleEdit = (resource) => {
    setEditing(resource.id)
    setForm({
      title: resource.title,
      description: resource.description,
      category: resource.category,
      tags: resource.tags || '',
      url: resource.url || '',
      is_free: resource.is_free,
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this resource?')) return
    try {
      await resourceService.delete(id)
      toast.success('Resource deleted')
      fetchResources()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm({ title: '', description: '', category: '', tags: '', url: '', is_free: true })
  }

  return (
    <>
      <SEOHead title="Manage Resources" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-100">Manage Resources</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm flex items-center gap-2">
            {showForm ? <><FiX className="w-4 h-4" /> Cancel</> : <><FiPlus className="w-4 h-4" /> Add Resource</>}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="card p-6 mb-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">
              {editing ? 'Edit Resource' : 'New Resource'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows="3" required />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Tags (comma separated)</label>
                <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">URL</label>
                <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="input-field" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.is_free} onChange={(e) => setForm({ ...form, is_free: e.target.checked })} id="is_free" />
                <label htmlFor="is_free" className="text-sm text-gray-400">Free resource</label>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button type="submit" className="btn-primary text-sm">{editing ? 'Update' : 'Create'}</button>
              <button type="button" onClick={resetForm} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hax-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : resources.length === 0 ? (
                  <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">No resources found</td></tr>
                ) : (
                  resources.map((r) => (
                    <tr key={r.id} className="border-b border-hax-border/50 hover:bg-hax-border/20">
                      <td className="px-4 py-3 text-sm text-gray-200">{truncate(r.title, 40)}</td>
                      <td className="px-4 py-3"><span className="badge">{r.category}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-400">{r.popularity_score || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(r)} className="p-1.5 text-gray-400 hover:text-hax-accent transition-colors">
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors">
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  )
}
