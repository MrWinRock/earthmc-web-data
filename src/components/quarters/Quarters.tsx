import { api } from "../../api";
import type { QuarterBasic, QuarterDetailed } from "../../interfaces/quarter";
import { useEntityBrowser } from "../../hooks/useEntityBrowser";
import { BrowserPage } from "../common/BrowserPage";
import { EntityCard } from "../common/EntityCard";
import { Badge } from "../ui";
import { rgbaToCss, titleCase } from "../../utils/format";
import QuarterModal from "./QuarterModal";

const Quarters = () => {
  const b = useEntityBrowser<QuarterBasic, QuarterDetailed>({
    list: api.listQuarters,
    query: api.queryQuarters,
    nameOf: (q) => q.name,
    pageSize: 12,
  });

  return (
    <BrowserPage
      title={<span className="accent">Quarters</span>}
      subtitle="Player-owned plots inside towns — apartments, shops and embassies. Search by name or UUID, or browse the directory."
      noun="quarters"
      browser={b}
      searchPlaceholder="Quarter name or UUID…"
      renderResult={(quarter, open) => (
        <EntityCard
          key={quarter.uuid}
          onClick={open}
          accentColor={rgbaToCss(quarter.colour)}
          title={quarter.name}
          badges={<Badge tone="info">{titleCase(quarter.type)}</Badge>}
          meta={
            <>
              <span>Owner · {quarter.owner.name || "Unowned"}</span>
              <span>Town · {quarter.town.name || "—"}</span>
            </>
          }
          footer={
            <>
              <span>{quarter.stats.numCuboids} cuboids</span>
              <span>vol {quarter.stats.volume.toLocaleString()}</span>
            </>
          }
        />
      )}
      renderListItem={(quarter, open) => (
        <EntityCard
          key={quarter.uuid}
          onClick={open}
          title={quarter.name}
          meta={<span className="uuid">{quarter.uuid}</span>}
        />
      )}
      modal={
        <QuarterModal
          isOpen={!!b.entity && !b.modalLoading}
          quarter={b.entity}
          onClose={b.closeModal}
        />
      }
    />
  );
};

export default Quarters;
