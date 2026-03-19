
import React from 'react';
import { useOrganization } from '../contexts/OrganizationContext';
import { BookingFormCategory, BookingFormField } from '../types';
import { ArrowUp, ArrowDown, MessageSquare, Plus } from 'lucide-react';

interface DynamicFormProps {
  schema: BookingFormCategory[];
  formData: any;
  onChange: (name: string, value: any) => void;
  isEditable?: boolean;
  onEditField?: (catId: string, fieldId: string) => void;
  onAddField?: (catId: string) => void;
  onRemoveField?: (catId: string, fieldId: string) => void;
  onMoveField?: (catId: string, fieldIndex: number, direction: 'up' | 'down') => void;
  onEditCategory?: (catId: string) => void;
  onRemoveCategory?: (catId: string) => void;
  onMoveCategory?: (index: number, direction: 'up' | 'down') => void;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({ 
  schema, 
  formData, 
  onChange,
  isEditable = false,
  onEditField,
  onAddField,
  onRemoveField,
  onMoveField,
  onEditCategory,
  onRemoveCategory,
  onMoveCategory
}) => {
  const { organization: org } = useOrganization();

  const isFieldVisible = (field: BookingFormField) => {
    if (!field.conditionalVisibility) return true;
    const { fieldId, value } = field.conditionalVisibility;
    return String(formData[fieldId]) === value;
  };

  const isCategoryVisible = (category: BookingFormCategory) => {
    if (!category.conditionalVisibility) return true;
    const { fieldId, value } = category.conditionalVisibility;
    return String(formData[fieldId]) === value;
  };

  return (
    <div className="space-y-8">
      {schema.map((category, catIndex) => {
        if (!isCategoryVisible(category) && !isEditable) return null;

        return (
          <div key={category.id} className={`space-y-4 relative group ${!isCategoryVisible(category) ? 'opacity-40 grayscale' : ''}`}>
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest inline-block"
                style={{ backgroundColor: org.primary_color }}
              >
                {category.name}
              </div>
              {isEditable && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onMoveCategory?.(catIndex, 'up')}
                    disabled={catIndex === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button 
                    onClick={() => onMoveCategory?.(catIndex, 'down')}
                    disabled={catIndex === schema.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              )}
            </div>
            {isEditable && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onEditCategory?.(category.id)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase"
                >
                  Rename
                </button>
                <button 
                  onClick={() => onRemoveCategory?.(category.id)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-600 uppercase"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            {category.fields.map((field, fieldIndex) => {
              if (!isFieldVisible(field) && !isEditable) return null;

              return (
                <div 
                  key={field.id} 
                  className={`flex items-center justify-between gap-4 relative group/field ${!isFieldVisible(field) ? 'opacity-40 grayscale' : ''}`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <label className="text-sm font-bold text-gray-600 truncate" title={field.label}>
                      {field.label}:
                      {field.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                    
                    {isEditable && (
                      <div className="flex gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity shrink-0">
                        <button 
                          onClick={() => onMoveField?.(category.id, fieldIndex, 'up')}
                          disabled={fieldIndex === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          onClick={() => onMoveField?.(category.id, fieldIndex, 'down')}
                          disabled={fieldIndex === category.fields.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-20"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 w-1/2 shrink-0">
                    <div className="flex items-center gap-2">
                      {field.type === 'text' && (
                        <input 
                          type="text"
                          value={formData[field.id] || ''}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (val.length > 0) {
                              val = val.charAt(0).toUpperCase() + val.slice(1);
                            }
                            onChange(field.id, val);
                          }}
                          onFocus={(e) => e.target.select()}
                          className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 outline-none transition-all"
                          style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                          disabled={isEditable}
                        />
                      )}
                      {field.type === 'number' && (
                        <input 
                          type="number"
                          min="0"
                          value={formData[field.id] || 0}
                          onChange={(e) => onChange(field.id, Math.max(0, Number(e.target.value)))}
                          onFocus={(e) => e.target.select()}
                          className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm w-full text-center focus:ring-2 outline-none transition-all"
                          style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                          disabled={isEditable}
                        />
                      )}
                      {field.type === 'boolean' && (
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={!!formData[field.id]}
                            onChange={(e) => onChange(field.id, e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 focus:ring-offset-0"
                            style={{ color: org.primary_color } as any}
                            disabled={isEditable}
                          />
                        </label>
                      )}
                      {field.type === 'select' && (
                        <select 
                          value={formData[field.id] || ''}
                          onChange={(e) => onChange(field.id, e.target.value)}
                          className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 outline-none transition-all"
                          style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                          disabled={isEditable}
                        >
                          <option value="">Select Option</option>
                          {field.options?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {isEditable && (
                        <div className="flex gap-1 opacity-0 group-hover/field:opacity-100 transition-opacity bg-white shadow-sm border border-gray-100 rounded-lg p-1">
                          <button 
                            onClick={() => onEditField?.(category.id, field.id)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Edit Field"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </button>
                          <button 
                            onClick={() => onRemoveField?.(category.id, field.id)}
                            className="p-1 text-rose-400 hover:text-rose-600"
                            title="Remove Field"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                          </button>
                        </div>
                      )}
                    </div>

                    {field.hasComment && (
                      <div className="flex items-start gap-2">
                        <MessageSquare size={14} className="text-gray-400 mt-2 shrink-0" />
                        <textarea onFocus={(e) => e.target.select()} 
                          placeholder="Add comment..."
                          value={formData[`${field.id}_comment`] || ''}
                          onChange={(e) => onChange(`${field.id}_comment`, e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs h-12 resize-none outline-none focus:ring-1"
                          style={{ '--tw-ring-color': `${org.primary_color}20` } as any}
                          disabled={isEditable}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isEditable && (
              <button 
                onClick={() => onAddField?.(category.id)}
                className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-2 text-xs font-bold text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all h-fit self-start mt-8"
              >
                <Plus size={14} />
                Add Field
              </button>
            )}
          </div>
          </div>
        );
      })}
    </div>
  );
};
