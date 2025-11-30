package pulsereactnativeotel.example

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import java.util.HashMap

class NativeNetworkPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == NativeNetworkModule.NAME) {
            NativeNetworkModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
            moduleInfos[NativeNetworkModule.NAME] = ReactModuleInfo(
                NativeNetworkModule.NAME,
                NativeNetworkModule.NAME,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                false,  // isCxxModule
                false   // isTurboModule - using legacy module for compatibility
            )
            moduleInfos
        }
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}

