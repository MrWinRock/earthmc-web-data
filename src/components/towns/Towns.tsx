import { api } from "../../api";
import type { TownBasic, TownDetailed } from "../../interfaces/town";
import { useEntityBrowser } from "../../hooks/useEntityBrowser";
import { BrowserPage } from "../common/BrowserPage";
import { EntityCard } from "../common/EntityCard";
import { Badge } from "../ui";
import { formatGold, formatNumber } from "../../utils/format";
import TownModal from "./TownModal";

const Towns = () => {
  const b = useEntityBrowser<TownBasic, TownDetailed>({
    list: api.listTowns,
    query: api.queryTowns,
    nameOf: (t) => t.name,
    pageSize: 12,
  });

  return (
    <BrowserPage
      title={<span className="accent">Towns</span>}
      subtitle="Every settlement on the map. Search by name or UUID, or browse and filter the full directory."
      noun="towns"
      browser={b}
      searchPlaceholder="Town name or UUID…"
      renderResult={(town, open) => (
        <EntityCard
          key={town.uuid}
          onClick={open}
          title={town.name}
          badges={town.status.isCapital ? <Badge tone="amber">Capital</Badge> : undefined}
          meta={
            <>
              <span>Mayor · {town.mayor.name}</span>
              <span>{town.nation.name ? `Nation · ${town.nation.name}` : "Unaffiliated"}</span>
            </>
          }
          footer={
            <>
              <span>{formatNumber(town.stats.numResidents)} residents</span>
              <span>{formatGold(town.stats.balance)}</span>
            </>
          }
        />
      )}
      renderListItem={(town, open) => (
        <EntityCard
          key={town.uuid}
          onClick={open}
          title={town.name}
          meta={<span className="uuid">{town.uuid}</span>}
        />
      )}
      modal={
        <TownModal
          isOpen={!!b.entity && !b.modalLoading}
          town={b.entity}
          onClose={b.closeModal}
        />
      }
    />
  );
};

export default Towns;
