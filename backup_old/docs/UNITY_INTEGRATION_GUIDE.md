# Unity-React 연동 가이드 (NYANG Project)

현재 프로젝트는 `react-unity-webgl`을 사용하여 유니티의 3D 다이오라마를 웹 상에 띄울 수 있도록 구성되었습니다.

## 1. 유니티 빌드 설정 (Unity Side)

유니티 프로젝트에서 다음과 같이 빌드해 주세요:

1. **Build Settings**:
   - Platform을 **WebGL**로 설정합니다.
   - **Player Settings** -> **Publishing Settings**에서 **Compression Format**을 `Gzip` 또는 `Disabled`로 설정하는 것을 권장합니다 (서버 설정에 따라 다름).
   - **Player Settings** -> **Resolution and Presentation**에서 WebGL Template을 `Default`로 설정합니다.

2. **빌드 경로 및 파일 이름**:
   - 빌드 결과물 중 `Build` 폴더 내부의 파일 이름을 다음과 같이 변경하여 `public/unity/Build/` 경로에 넣어주세요.
   - `UnityBuild.loader.js`
   - `UnityBuild.data`
   - `UnityBuild.framework.js`
   - `UnityBuild.wasm`

   > **Note**: 파일 이름을 바꾸기 번거롭다면 `src/shared/ui/UnityContainer.jsx` 파일 내의 `useUnityContext` 설정을 실제 파일 이름과 매칭되도록 수정하면 됩니다.

## 2. React에서의 조작 (React Side)

- 상단 헤더의 **🌐 3D** 버튼을 누르면 유니티 화면으로 전환됩니다.
- `UnityContainer.jsx`가 자동으로 `public/unity/Build/` 경로의 파일을 로드합니다.

## 3. Unity-React 통신 (C# -> JS)

유니티에서 리액트로 이벤트를 보내고 싶다면 다음과 같은 C# 코드를 작성하세요:

```csharp
using System.Runtime.InteropServices;

public class ReactBridge : MonoBehaviour {
    [DllImport("__Internal")]
    private static extern void OnCatAction(string actionName);

    public void PetCat() {
        #if !UNITY_EDITOR && UNITY_WEBGL
            OnCatAction("pet");
        #endif
    }
}
```

리액트 쪽에서는 `useUnityContext`의 `addEventListener`를 통해 이 메시지를 받을 수 있습니다.

---
추가로 필요한 연동 기능이 있다면 말씀해 주세요!
