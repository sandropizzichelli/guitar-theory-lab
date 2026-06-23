import React, { useEffect, useState } from "react";
import {
  TETRACHORD_KEYS,
  PENTACHORD_KEYS,
  HEXACHORD_KEYS,
  FORTE_4_8_DATA,
  FORTE_5_7_DATA,
  FORTE_6_DATA,
} from "./setData";
import {
  findTetrachordVoicings,
  findPentachordVoicings,
  findHexachordVoicings,
} from "./setUtils";
import { PillButton } from "./SetControls";
import GenericSetPage from "./GenericSetPage";
import TricordPage from "./TricordPage";
import {
  getCurrentSearchParams,
  readEnumParam,
  replaceSearchParams,
  setSearchParam,
} from "./urlState";

const PAGE_OPTIONS = ["trichords", "tetrachords", "pentachords", "hexachords"];
const LEGACY_PAGE_OPTIONS = {
  tricordi: "trichords",
  tetracordi: "tetrachords",
  pentacordi: "pentachords",
  esacordi: "hexachords",
};

function getInitialPage() {
  const params = getCurrentSearchParams();
  const page = params.get("page");
  return LEGACY_PAGE_OPTIONS[page] || readEnumParam(params, "page", PAGE_OPTIONS, "trichords");
}

function TetrachordPage() {
  return (
    <GenericSetPage
      title="Guitar tetrachord visualizer"
      description="Work directly with Allen Forte four-note set classes and playable guitar realizations."
      keyLabel="Forte tetrachord"
      keys={TETRACHORD_KEYS}
      dataMap={FORTE_4_8_DATA}
      findVoicingFn={findTetrachordVoicings}
      noteName="tetrachord"
      complementName="Complement"
      degreeButtonLabel="Degrees"
      noteCount={4}
    />
  );
}

function PentachordPage() {
  return (
    <GenericSetPage
      title="Guitar pentachord visualizer"
      description="Work directly with Allen Forte five-note set classes and playable guitar realizations."
      keyLabel="Forte pentachord"
      keys={PENTACHORD_KEYS}
      dataMap={FORTE_5_7_DATA}
      findVoicingFn={findPentachordVoicings}
      noteName="pentachord"
      complementName="Complement"
      degreeButtonLabel="Degrees"
      noteCount={5}
    />
  );
}

function HexachordPage() {
  return (
    <GenericSetPage
      title="Guitar hexachord visualizer"
      description="Work directly with Allen Forte six-note set classes and playable guitar realizations."
      keyLabel="Forte hexachord"
      keys={HEXACHORD_KEYS}
      dataMap={FORTE_6_DATA}
      findVoicingFn={findHexachordVoicings}
      noteName="hexachord"
      complementName="Complement"
      degreeButtonLabel="Degrees"
      noteCount={6}
    />
  );
}

function PageSwitcher({ page, setPage }) {
  return (
    <div className="page-switcher">
      <div className="page-switcher__panel">
        <div className="page-switcher__copy">
          <div className="eyebrow">Set-class explorer</div>
        </div>

        <div className="page-switcher__actions">
          <PillButton active={page === "trichords"} onClick={() => setPage("trichords")}>
            Trichords
          </PillButton>
          <PillButton
            active={page === "tetrachords"}
            onClick={() => setPage("tetrachords")}
          >
            Tetrachords
          </PillButton>
          <PillButton
            active={page === "pentachords"}
            onClick={() => setPage("pentachords")}
          >
            Pentachords
          </PillButton>
          <PillButton active={page === "hexachords"} onClick={() => setPage("hexachords")}>
            Hexachords
          </PillButton>
        </div>
      </div>
    </div>
  );
}

export default function SetVisualizer() {
  const [page, setPage] = useState(getInitialPage);

  useEffect(() => {
    replaceSearchParams((params) => {
      setSearchParam(params, "page", page);
    });
  }, [page]);

  return (
    <>
      <PageSwitcher page={page} setPage={setPage} />
      {page === "trichords" && <TricordPage />}
      {page === "tetrachords" && <TetrachordPage />}
      {page === "pentachords" && <PentachordPage />}
      {page === "hexachords" && <HexachordPage />}
    </>
  );
}
