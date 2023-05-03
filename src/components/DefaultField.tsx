import { Field, FieldWrapper } from "@contentful/default-field-editors";
import { ContentFields, KeyValueMap } from "contentful-management";


export interface DefaultFieldProps {
  field: ContentFields<KeyValueMap>;
  sdk: any;
  widgetId: string | null;
}

const DefaultField = (props: DefaultFieldProps) => {
  const { field, sdk, widgetId } = props;
  return (
    <FieldWrapper sdk={sdk} name={field.name} showFocusBar={true}>
      <Field sdk={sdk} widgetId={widgetId!} />
    </FieldWrapper>
  );
};
  
export default DefaultField