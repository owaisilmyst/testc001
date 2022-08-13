import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  useMemo,
  useCallback,
} from "react";

import { createPortal } from "react-dom";
import styles from "../styles/portal-popup.module.css";

type PopupProps = {
  overlayColor?: string;
  placement?:
    | "Centered"
    | "Top left"
    | "Top center"
    | "Top right"
    | "Bottom left"
    | "Bottom center"
    | "Bottom right";

  onOutsideClick?: () => void;
  zIndex?: number;
  children: ReactNode;
};

const PortalPopup: FunctionComponent<PopupProps> = ({
  children,
  overlayColor,
  placement = "Centered",
  onOutsideClick,
  zIndex = 100,
}) => {
  const popupStyle = useMemo(() => {
    const style: CSSProperties = {};
    style.zIndex = zIndex;

    if (overlayColor) {
      style.backgroundColor = overlayColor;
    }

    switch (placement) {
      case "Centered":
        style.alignItems = "center";
        style.justifyContent = "center";
        break;
      case "Top left":
        style.alignItems = "flex-start";
        break;
      case "Top center":
        style.alignItems = "center";
        break;
      case "Top right":
        style.alignItems = "flex-end";
        break;
      case "Bottom left":
        style.alignItems = "flex-start";
        style.justifyContent = "flex-end";
        break;
      case "Bottom center":
        style.alignItems = "center";
        style.justifyContent = "flex-end";
        break;
      case "Bottom right":
        style.alignItems = "flex-end";
        style.justifyContent = "flex-end";
        break;
    }

    return style;
  }, [placement, overlayColor, zIndex]);

  const onOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (
        onOutsideClick &&
        (e.target as HTMLElement).classList.contains(styles.portalPopupOverlay)
      ) {
        onOutsideClick();
      }
      e.stopPropagation();
    },
    [onOutsideClick]
  );

  return (
    <Portal>
      <div
        className={styles.portalPopupOverlay}
        style={popupStyle}
        onClick={onOverlayClick}
      >
        {children}
      </div>
    </Portal>
  );
};

type PortalProps = {
  children: ReactNode;
  containerId?: string;
};

export const Portal: FunctionComponent<PortalProps> = ({
  children,
  containerId = "portals",
}) => {
  if (typeof window !== "undefined") {
    let portalsDiv = document.getElementById(containerId);
    if (!portalsDiv) {
      portalsDiv = document.createElement("div");
      portalsDiv.setAttribute("id", containerId);
      document.body.appendChild(portalsDiv);
    }
    return createPortal(children, portalsDiv);
  } else {
    return <div></div>;
  }
};
export default PortalPopup;
