import React, { useCallback, useMemo, useState } from 'react';
import { Box } from '@contentful/f36-components';
import { EditorAppSDK, EditorExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import DefaultField from '../components/DefaultField';


// Converts a field into <FieldAPI> data type, which is the expected data type for many API methods
const getFieldAPI = (fieldId: string, sdk: EditorExtensionSDK) =>
  sdk.entry.fields[fieldId].getForLocale(sdk.locales.default);

// Creates a <FieldExtensionSDK> type that can be passed to components from the default-field-editors package
const getFieldExtensionSdk = (fieldId: string, sdk: EditorExtensionSDK) =>
  Object.assign({ field: getFieldAPI(fieldId, sdk) }, sdk);

const Entry = () => {
  const [values, setValues] = useState<{ [key: string]: any}>({})
  const sdk = useSDK<EditorAppSDK>();
  const entryType = useMemo(() => sdk.contentType.sys.id, [sdk])
  const fields = useMemo(() => sdk.contentType.fields, [sdk])
  const params = useMemo(() => sdk.parameters?.installation || {}, [sdk])

  const updateValue = useCallback((id: string, value: any) => {
    setValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }, [])

  const filteredFields = useMemo(() => {
    if (entryType in params === false) {
      return fields 
    }
    
    let show : string[] = []

    const groups = params[entryType]
    console.log('groups', groups)
    groups.forEach((group: { [key: string]: any}) => {
      const checkFields = Object.keys(group)
      console.log('checkFields', checkFields)

      checkFields.forEach(fieldId => {
        console.log(`checks for: ${fieldId}`)
        const checks : { show?: string[], hide?: string[], value: string, condition: string }[] = group[fieldId]
        // determine which fields to show
        checks.forEach((check) => {
          console.log(` - ${check.condition} ${check.value} hide: ${JSON.stringify(check.hide ||[])} show: ${JSON.stringify(check.show ||[])}`)
          if (check.condition === 'equal') {
            if (values[fieldId] === check.value) {
              if (check.show) {
                show = [
                  ...show,
                  ...check.show
                ]
              }
              if (check.hide) {
                show = show.filter(field => check.hide?.includes(field))
              }
            }
          }
          if (check.condition === 'notequal') {
            if (values[fieldId] !== check.value) {
              if (check.show) {
                show = [
                  ...show,
                  ...check.show
                ]
              }
              if (check.hide) {
                show = show.filter(field => check.hide?.includes(field))
              }
            }
          }
        })
      })
    })


    return fields.filter(field => show.includes(field.id))
  }, [fields, params, entryType, values])

  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  return (
    <Box
      style={{
        maxWidth: '768px',
        margin: '0 auto',
        padding: '24px 0px 100px 0px'
      }}
    >
      {filteredFields.map((field) => {
        const control = sdk.editor.editorInterface.controls!.find(
          (control) => control.fieldId === field.id
        );
        const widgetId = control?.widgetId || null;
        
        return (
          <DefaultField
            key={field.id}
            field={field}
            sdk={getFieldExtensionSdk(field.id, sdk)}
            widgetId={widgetId}
            onChange={updateValue}
          />
        );
      })}
    </Box>
  );

};

export default Entry;
