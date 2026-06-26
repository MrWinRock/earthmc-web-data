import { api } from "../../api";
import type { NationBasic, NationDetailed } from "../../interfaces/nation";
import { useEntityBrowser } from "../../hooks/useEntityBrowser";
import { BrowserPage } from "../common/BrowserPage";
import { EntityCard } from "../common/EntityCard";
import { formatGold, formatNumber } from "../../utils/format";
import NationModal from "./NationModal";

const Nations = () => {
  const b = useEntityBrowser<NationBasic, NationDetailed>({
    list: api.listNations,
    query: api.queryNations,
    nameOf: (n) => n.name,
    pageSize: 12,
  });

  return (
    <BrowserPage
      title={<span className="accent">Nations</span>}
      subtitle="Sovereign nations and their alliances. Search by name or UUID, or browse the full list."
      noun="nations"
      browser={b}
      searchPlaceholder="Nation name or UUID…"
      renderResult={(nation, open) => (
        <EntityCard
          key={nation.uuid}
          onClick={open}
          accentColor={nation.dynmapColour}
          title={nation.name}
          meta={
            <>
              <span>King · {nation.king.name}</span>
              <span>Capital · {nation.capital.name}</span>
            </>
          }
          footer={
            <>
              <span>{formatNumber(nation.stats.numTowns)} towns</span>
              <span>{formatNumber(nation.stats.numResidents)} residents</span>
              <span>{formatGold(nation.stats.balance)}</span>
            </>
          }
        />
      )}
      renderListItem={(nation, open) => (
        <EntityCard
          key={nation.uuid}
          onClick={open}
          title={nation.name}
          meta={<span className="uuid">{nation.uuid}</span>}
        />
      )}
      modal={
        <NationModal
          isOpen={!!b.entity && !b.modalLoading}
          nation={b.entity}
          onClose={b.closeModal}
        />
      }
    />
  );
};

export default Nations;
