import { Field, FieldWrapper } from "@contentful/default-field-editors";
import { ContentFields, KeyValueMap } from "contentful-management";
import { useFieldValue } from '@contentful/react-apps-toolkit';
import { useEffect } from "react";


export interface DefaultFieldProps {
  field: ContentFields<KeyValueMap>;
  sdk: any;
  widgetId: string | null;
  onChange?: (id: string, value: any) => void
}

const DefaultField = ({ field, sdk, widgetId, onChange }: DefaultFieldProps) => {
  const [value] = useFieldValue(field.id, 'en-US');

  useEffect(() => {
    if (onChange) {
      onChange(field.id, value)
    }    
  }, [value, field, onChange])

 
  return (
    <FieldWrapper sdk={sdk} name={field.name} showFocusBar={true}>
      <Field sdk={sdk} widgetId={widgetId!} />
    </FieldWrapper>
  );
};
  
export default DefaultField