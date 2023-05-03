import React from 'react';
import { Box, Paragraph } from '@contentful/f36-components';
import { EditorAppSDK, EditorExtensionSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import DefaultField from '../components/DefaultField';


// Converts a field into <FieldAPI> data type, which is the expected data type for many API methods
const getFieldAPI = (fieldId: string, sdk: EditorExtensionSDK) =>
  sdk.entry.fields[fieldId].getForLocale(sdk.locales.default);

// Creates a <FieldExtensionSDK> type that can be passed to components from the default-field-editors package
const getFieldExtensionSdk = (fieldId: string, sdk: EditorExtensionSDK) =>
  Object.assign({ field: getFieldAPI(fieldId, sdk) }, sdk);

const Entry = () => {
  const sdk = useSDK<EditorAppSDK>();
  const fields = sdk.contentType.fields

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
          padding: '24px 24px 100px 24px'
        }}
      >
      {fields.map((field) => {
        const control = sdk.editor.editorInterface.controls!.find(
          (control) => control.fieldId === field.id
        );
        const widgetId = control?.widgetId || null;
        

        return (
          <>
            <DefaultField
              key={field.id}
              field={field}
              sdk={getFieldExtensionSdk(field.id, sdk)}
              widgetId={widgetId}
            />
          </>
        );
      })}
    </Box>
  );

};

export default Entry;
