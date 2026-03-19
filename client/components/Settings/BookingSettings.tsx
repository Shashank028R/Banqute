import React, { useState } from 'react';
import { useOrganization } from '../../contexts/OrganizationContext';
import { 
  Plus, Trash2, Edit2, ChevronUp, ChevronDown, 
  Settings2, Layout, CheckCircle2, Save, X,
  GripVertical, Type, Hash, CheckSquare, List,
  Copy, Package, Info
} from 'lucide-react';
import { BookingTemplate, EventType } from '../../types';

export const BookingSettings: React.FC = () => {
  const { organization: org, updateOrganization } = useOrganization();
  const [activeTab, setActiveTab] = useState<'form' | 'templates' | 'expenses'>('form');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ catId: string, fieldId: string } | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const saveSchema = (newSchema: typeof org.bookingFormSchema) => {
    updateOrganization({ bookingFormSchema: newSchema });
  };

  const saveTemplates = (newTemplates: BookingTemplate[]) => {
    updateOrganization({ bookingTemplates: newTemplates });
  };

  const saveExpenseCategories = (newCategories: string[]) => {
    updateOrganization({ expenseCategories: newCategories });
  };

  const addTemplate = () => {
    const newTemplate: BookingTemplate = {
      id: `tmpl_${Date.now()}`,
      name: 'New Template',
      package: 'Standard',
      fieldValues: {}
    };
    saveTemplates([...(org.bookingTemplates || []), newTemplate]);
    setEditingTemplate(newTemplate.id);
  };

  const removeTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to remove this template?')) {
      saveTemplates((org.bookingTemplates || []).filter(t => t.id !== id));
    }
  };

  const updateTemplate = (id: string, updates: Partial<BookingTemplate>) => {
    const newTemplates = (org.bookingTemplates || []).map(t => {
      if (t.id === id) return { ...t, ...updates };
      return t;
    });
    saveTemplates(newTemplates);
  };

  const updateTemplateFieldValue = (templateId: string, fieldId: string, value: any) => {
    const newTemplates = (org.bookingTemplates || []).map(t => {
      if (t.id === templateId) {
        return {
          ...t,
          fieldValues: { ...t.fieldValues, [fieldId]: value }
        };
      }
      return t;
    });
    saveTemplates(newTemplates);
  };

  const addCategory = () => {
    const newCat = {
      id: `cat_${Date.now()}`,
      name: 'New Category',
      fields: []
    };
    saveSchema([...org.bookingFormSchema, newCat]);
    setEditingCategory(newCat.id);
  };

  const removeCategory = (id: string) => {
    if (window.confirm('Are you sure you want to remove this category and all its fields?')) {
      saveSchema(org.bookingFormSchema.filter(c => c.id !== id));
    }
  };

  const addField = (catId: string) => {
    const newField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text' as const,
      required: false
    };
    const newSchema = org.bookingFormSchema.map(cat => {
      if (cat.id === catId) {
        return { ...cat, fields: [...cat.fields, newField] };
      }
      return cat;
    });
    saveSchema(newSchema);
    setEditingField({ catId, fieldId: newField.id });
  };

  const removeField = (catId: string, fieldId: string) => {
    const newSchema = org.bookingFormSchema.map(cat => {
      if (cat.id === catId) {
        return { ...cat, fields: cat.fields.filter(f => f.id !== fieldId) };
      }
      return cat;
    });
    saveSchema(newSchema);
  };

  const updateCategory = (id: string, updates: any) => {
    const newSchema = org.bookingFormSchema.map(cat => {
      if (cat.id === id) return { ...cat, ...updates };
      return cat;
    });
    saveSchema(newSchema);
  };

  const updateField = (catId: string, fieldId: string, updates: any) => {
    const newSchema = org.bookingFormSchema.map(cat => {
      if (cat.id === catId) {
        return {
          ...cat,
          fields: cat.fields.map(f => f.id === fieldId ? { ...f, ...updates } : f)
        };
      }
      return cat;
    });
    saveSchema(newSchema);
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newSchema = [...org.bookingFormSchema];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSchema.length) return;
    [newSchema[index], newSchema[targetIndex]] = [newSchema[targetIndex], newSchema[index]];
    saveSchema(newSchema);
  };

  const moveField = (catId: string, fieldIndex: number, direction: 'up' | 'down') => {
    const newSchema = org.bookingFormSchema.map(cat => {
      if (cat.id === catId) {
        const newFields = [...cat.fields];
        const targetIndex = direction === 'up' ? fieldIndex - 1 : fieldIndex + 1;
        if (targetIndex < 0 || targetIndex >= newFields.length) return cat;
        [newFields[fieldIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[fieldIndex]];
        return { ...cat, fields: newFields };
      }
      return cat;
    });
    saveSchema(newSchema);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Info */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <Layout className="text-indigo-600" />
            Booking Configuration
          </h2>
          <p className="text-gray-500 text-sm mt-1">Manage your reservation form and preset booking templates.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'form' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Form Editor
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'templates' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Templates
          </button>
          <button 
            onClick={() => setActiveTab('expenses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'expenses' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Expenses
          </button>
        </div>
      </div>

      {activeTab === 'form' ? (
        <>
          <div className="flex justify-end mb-4">
            <button 
              onClick={addCategory}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
          {/* Visual Editor Area */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Mock Letterhead */}
        <div 
          className="p-8 text-center text-white relative overflow-hidden"
          style={{ backgroundColor: org.primary_color }}
        >
          <h1 className="text-3xl font-serif font-bold mb-1">{org.name}</h1>
          <p className="text-sm opacity-80 uppercase tracking-widest font-bold">Reservation Form Preview</p>
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          </div>
        </div>

        <div className="p-8 space-y-12">
          {org.bookingFormSchema.map((category, catIdx) => (
            <div key={category.id} className="relative group/cat">
              {/* Category Header with Controls */}
              <div className="flex items-center justify-between border-b-2 pb-2 mb-6" style={{ borderBottomColor: `${org.primary_color}20` }}>
                {editingCategory === category.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input 
                      autoFocus
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                      onBlur={() => setEditingCategory(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingCategory(null)}
                      className="text-xl font-black uppercase tracking-tight bg-gray-50 border-none focus:ring-0 p-0 w-full"
                      style={{ color: org.primary_color }}
                    />
                  </div>
                ) : (
                  <h3 
                    className="text-xl font-black uppercase tracking-tight cursor-pointer hover:opacity-70 transition-opacity"
                    style={{ color: org.primary_color }}
                    onClick={() => setEditingCategory(category.id)}
                  >
                    {category.name}
                  </h3>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover/cat:opacity-100 transition-opacity">
                  <button onClick={() => moveCategory(catIdx, 'up')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><ChevronUp size={16} /></button>
                  <button onClick={() => moveCategory(catIdx, 'down')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><ChevronDown size={16} /></button>
                  <button onClick={() => addField(category.id)} className="p-1.5 hover:bg-indigo-50 rounded-lg text-indigo-600 flex items-center gap-1 text-xs font-bold uppercase ml-2">
                    <Plus size={14} /> Add Field
                  </button>
                  <button onClick={() => removeCategory(category.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 ml-1"><Trash2 size={16} /></button>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.fields.map((field, fieldIdx) => (
                  <div key={field.id} className="relative group/field p-4 rounded-2xl border border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                    {/* Field Controls */}
                    <div className="absolute -top-3 -right-3 flex items-center gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity z-10">
                      <div className="flex bg-white shadow-md border border-gray-100 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => moveField(category.id, fieldIdx, 'up')}
                          disabled={fieldIdx === 0}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button 
                          onClick={() => moveField(category.id, fieldIdx, 'down')}
                          disabled={fieldIdx === category.fields.length - 1}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => setEditingField({ catId: category.id, fieldId: field.id })}
                        className="p-1.5 bg-white shadow-md border border-gray-100 rounded-lg text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => removeField(category.id, field.id)}
                        className="p-1.5 bg-white shadow-md border border-gray-100 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Field Preview */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider truncate" title={field.label}>
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <div className="text-[10px] font-bold text-indigo-500 uppercase bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">
                          {field.type}
                        </div>
                      </div>
                      
                      <div className="w-1/2 shrink-0">
                        {field.type === 'boolean' ? (
                          <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
                            <div className="w-5 h-5 rounded border border-gray-300"></div>
                            <span className="text-sm text-gray-400 italic">Checkbox</span>
                          </div>
                        ) : field.type === 'select' ? (
                          <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 flex justify-between items-center">
                            <span className="truncate">{field.options?.[0] || 'Select Option'}</span>
                            <ChevronDown size={14} className="shrink-0" />
                          </div>
                        ) : (
                          <div className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-400 truncate">
                            {field.type === 'number' ? '0' : `Enter ${field.label.toLowerCase()}...`}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {category.fields.length === 0 && (
                  <div className="col-span-full py-8 border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400">
                    <p className="text-sm font-medium">No fields in this category yet.</p>
                    <button 
                      onClick={() => addField(category.id)}
                      className="mt-2 text-xs font-bold text-indigo-600 uppercase hover:underline"
                    >
                      + Add your first field
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {org.bookingFormSchema.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Layout size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your form is empty</h3>
                <p className="text-gray-500 text-sm">Start by adding a category to organize your fields.</p>
              </div>
              <button 
                onClick={addCategory}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100"
              >
                Create First Category
              </button>
            </div>
          )}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Preset Booking Templates</h3>
            <button 
              onClick={addTemplate}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Plus size={18} />
              Create Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(org.bookingTemplates || []).map((template) => (
              <div key={template.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Copy size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase tracking-tight">{template.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{template.package} Package</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingTemplate(template.id)}
                      className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => removeTemplate(template.id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(template.fieldValues).slice(0, 5).map(([fieldId, value]) => (
                      <div key={fieldId} className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600 uppercase">
                        {fieldId}: {String(value)}
                      </div>
                    ))}
                    {Object.keys(template.fieldValues).length > 5 && (
                      <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-400 uppercase">
                        +{Object.keys(template.fieldValues).length - 5} more
                      </div>
                    )}
                    {Object.keys(template.fieldValues).length === 0 && (
                      <span className="text-xs text-gray-400 italic">No preset values configured.</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {(org.bookingTemplates || []).length === 0 && (
              <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Copy size={32} />
                </div>
                <div className="text-center">
                  <p className="font-bold">No templates created yet.</p>
                  <p className="text-xs">Create templates to pre-fill booking forms based on packages.</p>
                </div>
                <button 
                  onClick={addTemplate}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold uppercase tracking-widest text-[10px]"
                >
                  Create First Template
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Template Editor Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Copy size={20} />
                </div>
                <h4 className="font-black text-gray-900 uppercase tracking-tight">Edit Template: {(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.name}</h4>
              </div>
              <button onClick={() => setEditingTemplate(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Template Name</label>
                  <input 
                    type="text"
                    value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.name || ''}
                    onChange={(e) => updateTemplate(editingTemplate, { name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Associated Package</label>
                  <input 
                    type="text"
                    value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.package || ''}
                    onChange={(e) => updateTemplate(editingTemplate, { package: e.target.value })}
                    placeholder="e.g. Gold, Silver, Diamond"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Settings2 size={18} />
                  <h5 className="font-black uppercase tracking-widest text-sm">Standard Fields</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div className="space-y-4">
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-1">Basic Information</h6>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-xs font-bold text-gray-600 truncate flex-1">Event Type</label>
                        <div className="w-48">
                          <select 
                            value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues['eventType'] || ''}
                            onChange={(e) => updateTemplateFieldValue(editingTemplate, 'eventType', e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                          >
                            <option value="">Not Set</option>
                            {Object.values(EventType).map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-xs font-bold text-gray-600 truncate flex-1">Shift</label>
                        <div className="w-48">
                          <select 
                            value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues['shift'] || ''}
                            onChange={(e) => updateTemplateFieldValue(editingTemplate, 'shift', e.target.value)}
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                          >
                            <option value="">Not Set</option>
                            <option value="Morning">Morning</option>
                            <option value="Night">Night</option>
                            <option value="Full Day">Full Day</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-xs font-bold text-gray-600 truncate flex-1">Expected Guests</label>
                        <div className="w-48">
                          <input 
                            type="number"
                            min="0"
                            value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues['guests'] || ''}
                            onChange={(e) => updateTemplateFieldValue(editingTemplate, 'guests', Math.max(0, Number(e.target.value)))}
                            placeholder="Not Set"
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h6 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-1">Financial Details</h6>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-xs font-bold text-gray-600 truncate flex-1">Package Rate (₹)</label>
                        <div className="w-48">
                          <input 
                            type="number"
                            min="0"
                            value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues['package_rate'] || ''}
                            onChange={(e) => updateTemplateFieldValue(editingTemplate, 'package_rate', Math.max(0, Number(e.target.value)))}
                            placeholder="Not Set"
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-xs font-bold text-gray-600 truncate flex-1">Add-on Services (₹)</label>
                        <div className="w-48">
                          <input 
                            type="number"
                            min="0"
                            value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues['addon_services'] || ''}
                            onChange={(e) => updateTemplateFieldValue(editingTemplate, 'addon_services', Math.max(0, Number(e.target.value)))}
                            placeholder="Not Set"
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <label className="text-xs font-bold text-gray-600 truncate flex-1">Discount (₹)</label>
                        <div className="w-48">
                          <input 
                            type="number"
                            min="0"
                            value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues['discount'] || ''}
                            onChange={(e) => updateTemplateFieldValue(editingTemplate, 'discount', Math.max(0, Number(e.target.value)))}
                            placeholder="Not Set"
                            className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-indigo-600">
                  <Settings2 size={18} />
                  <h5 className="font-black uppercase tracking-widest text-sm">Custom Fields</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {org.bookingFormSchema.map((category) => (
                    <div key={category.id} className="space-y-4">
                      <h6 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100 pb-1">{category.name}</h6>
                      <div className="space-y-4">
                        {category.fields.map((field) => (
                          <div key={field.id} className="flex items-center justify-between gap-4">
                            <label className="text-xs font-bold text-gray-600 truncate flex-1">{field.label}</label>
                            <div className="w-48">
                              {field.type === 'boolean' ? (
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="checkbox"
                                    checked={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues[field.id] || false}
                                    onChange={(e) => updateTemplateFieldValue(editingTemplate, field.id, e.target.checked)}
                                    className="w-5 h-5 rounded text-indigo-600 focus:ring-offset-0"
                                  />
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">{(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues[field.id] ? 'Yes' : 'No'}</span>
                                </div>
                              ) : field.type === 'select' ? (
                                <select 
                                  value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues[field.id] || ''}
                                  onChange={(e) => updateTemplateFieldValue(editingTemplate, field.id, e.target.value)}
                                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                                >
                                  <option value="">Not Set</option>
                                  {field.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : (
                                <input 
                                  type={field.type === 'number' ? 'number' : 'text'}
                                  value={(org.bookingTemplates || []).find(t => t.id === editingTemplate)?.fieldValues[field.id] || ''}
                                  onChange={(e) => updateTemplateFieldValue(editingTemplate, field.id, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                  placeholder="Not Set"
                                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-400">
                <Info size={14} />
                <p className="text-[10px] font-medium italic">Changes are saved automatically to the template.</p>
              </div>
              <button 
                onClick={() => setEditingTemplate(null)}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Done Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Expense Categories</h3>
            <button 
              onClick={() => {
                const newCategories = [...(org.expenseCategories || []), 'New Category'];
                saveExpenseCategories(newCategories);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              {(org.expenseCategories || []).map((category, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <input
                    type="text"
                    value={category}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const newCategories = [...(org.expenseCategories || [])];
                      let val = e.target.value;
                      if (val.length > 0) {
                        val = val.charAt(0).toUpperCase() + val.slice(1);
                      }
                      newCategories[idx] = val;
                      saveExpenseCategories(newCategories);
                    }}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-gray-700"
                    placeholder="Category Name"
                  />
                  <button
                    onClick={() => {
                      const newCategories = [...(org.expenseCategories || [])];
                      newCategories.splice(idx, 1);
                      saveExpenseCategories(newCategories);
                    }}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {(!org.expenseCategories || org.expenseCategories.length === 0) && (
                <div className="py-12 text-center text-gray-400">
                  <p className="font-medium">No expense categories configured.</p>
                  <p className="text-sm mt-1">Add categories to organize your event expenses.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Field Editor Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h4 className="font-black text-gray-900 uppercase tracking-tight">Edit Field Settings</h4>
              <button onClick={() => setEditingField(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Field Label</label>
                <input 
                  type="text"
                  value={org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.label || ''}
                  onChange={(e) => updateField(editingField.catId, editingField.fieldId, { label: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Input Type</label>
                  <select 
                    value={org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.type || 'text'}
                    onChange={(e) => updateField(editingField.catId, editingField.fieldId, { type: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="text">Text Input</option>
                    <option value="number">Number Input</option>
                    <option value="boolean">Checkbox / Toggle</option>
                    <option value="select">Dropdown Select</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Requirement</label>
                  <div className="flex items-center gap-2 h-[46px]">
                    <input 
                      type="checkbox"
                      id="field-required"
                      checked={org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.required || false}
                      onChange={(e) => updateField(editingField.catId, editingField.fieldId, { required: e.target.checked })}
                      className="w-5 h-5 rounded text-indigo-600 focus:ring-offset-0"
                    />
                    <label htmlFor="field-required" className="text-sm font-bold text-gray-700 cursor-pointer">Required Field</label>
                  </div>
                </div>
              </div>

              {org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.type === 'select' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dropdown Options</label>
                  <div className="space-y-2">
                    {(org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.options || []).map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...(org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.options || [])];
                            newOptions[idx] = e.target.value;
                            updateField(editingField.catId, editingField.fieldId, { options: newOptions });
                          }}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm"
                          placeholder={`Option ${idx + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newOptions = [...(org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.options || [])];
                            newOptions.splice(idx, 1);
                            updateField(editingField.catId, editingField.fieldId, { options: newOptions });
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newOptions = [...(org.bookingFormSchema.find(c => c.id === editingField.catId)?.fields.find(f => f.id === editingField.fieldId)?.options || []), ''];
                        updateField(editingField.catId, editingField.fieldId, { options: newOptions });
                      }}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase hover:underline mt-2"
                    >
                      <Plus size={14} /> Add Option
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setEditingField(null)}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
