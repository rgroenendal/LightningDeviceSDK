import {
   IDeviceUIApi,
   IDeviceStreamApi,
   IDeviceManagerApi,
   IUIAreaApi,
   IUIElementApi
} from '../../public/device-api';
import { PluginFeatureTypes } from '../../public/plugin-api';

/**
 * Expose a class that LabChart Lightning will use when evaluating what
 * User Interface to present to the user when configuring devices of this
 * type.
 */
export class DeviceUI implements IDeviceUIApi {
   name = 'SerialSettings UI';
   type: PluginFeatureTypes = 'Device UI';
   matchesDevice(deviceDisplayName: string) {
      return deviceDisplayName === 'SerialSettings';
   }

   /**
    * Defines the user interface elements that will be used to adjust basic
    * rate / range settings for this device.
    *
    * @param streamSettings settings for the current stream within the recording.
    * @param deviceIndex 0-based index of the stream's device within the recording.
    * @param deviceManager Reference to the current device manager.
    */
   describeStreamSettingsUI(
      settings: IDeviceStreamApi,
      deviceIndex: number,
      deviceManager: IDeviceManagerApi
   ): IUIAreaApi {
      // UI elements that will be shown in the signal sampling settings UI.
      // Returned from this function.
      const elements: IUIElementApi[] = [];

      // Add a title describing the device being configured and subtitle with the
      // name of the current stream.
      elements.push({
         type: 'header',
         title: 'SerialSettings Device',
         subtitle: `${deviceManager.deviceDisplayName(
            deviceIndex
         )}, ${settings.streamName || 'Input'}`
      });

      // Add a dropdown list allowing user to choose a supported rate.
      elements.push({
         type: 'setting',
         setting: settings.samplesPerSec,
         controlType: 'rate-list',
         // Disable the dropdown if recording is in single-rate mode (the default).
         disabled: !deviceManager.multiRate,
         // Optional information tooltip displayed next to dropdown when the
         // recording is in single-rate mode to explain why the element is disabled.
         info: deviceManager.multiRate
            ? undefined
            : 'Setting a different rate for just this signal requires enabling Multi Rate in Recording Sampling Settings'
      });

      // Add a list element for selecting the stream's input gain.
      elements.push({
         type: 'setting',
         controlType: 'list',
         setting: settings.inputSettings.range
      });

      // Include a live sampling preview of the signal with settings applied.
      elements.push({
         type: 'signal-preview'
      });

      return {
         elements,
         layout: 'default',
         desiredWidthPixels: 650,
         desiredHeightPixels: 400
      };
   }
}

module.exports = {
   // Function that Lightning looks for within our exports and invokes on
   // application startup.
   getDeviceUIClasses() {
      return [new DeviceUI()];
   }
};
