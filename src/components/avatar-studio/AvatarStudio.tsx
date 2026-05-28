"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookmarkPlus, Send, ShoppingBag, UserRound } from "lucide-react";
import type { Colour } from "@/types/clothing";
import type { OutfitItem } from "@/types/outfit";
import type { EventType } from "@/types/vendor";
import { useTryOn } from "@/hooks/useTryOn";
import { useOutfitsStore } from "@/store/outfits.store";
import { useCartStore } from "@/store/cart.store";
import { useStylingRequestsStore } from "@/store/styling-requests.store";
import { useUIStore } from "@/store/ui.store";
import { Button } from "@/components/ui/Button";
import { ColourSwitcher } from "@/components/try-on/ColourSwitcher";
import { ItemLayerCard } from "./ItemLayerCard";
import { LayerPanel } from "./LayerPanel";
import { SendToVendorModal } from "./SendToVendorModal";

export function AvatarStudio() {
  const {
    layers,
    addLayer,
    removeLayer,
    swapColour,
    exportSnapshot,
  } = useTryOn();
  const { save: saveOutfit } = useOutfitsStore();
  const { add: addToCart } = useCartStore();
  const { submit: submitRequest } = useStylingRequestsStore();
  const { addToast } = useUIStore();

  const [showModal, setShowModal] = useState(false);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const [avatarPhoto, setAvatarPhoto] = useState<string | null>(null);

  useEffect(() => {
    setAvatarPhoto(localStorage.getItem("virea_avatar_photo"));
  }, []);

  const focusedLayer =
    layers.find((l) => l.itemId === focusedItemId) ?? layers[layers.length - 1] ?? null;

  const handleColourSwap = (colour: Colour) => {
    if (focusedLayer) swapColour(focusedLayer.itemId, colour);
  };

  const handleSaveLook = () => {
    if (layers.length === 0) {
      addToast("Add at least one item to save a look", "info");
      return;
    }
    const snapshot = exportSnapshot();
    const outfitItems: OutfitItem[] = layers.map((l) => ({
      id: `oi-${l.itemId}-${Date.now()}`,
      item_id: l.itemId,
      selected_colour: l.selectedColour,
      selected_size: l.item.available_sizes[0],
    }));
    saveOutfit(layers.map((l) => l.item.name).join(" + "), outfitItems, snapshot);
    addToast("Look saved!");
  };

  const handleAddAllToBag = () => {
    if (layers.length === 0) {
      addToast("Add at least one item first", "info");
      return;
    }
    layers.forEach((l) => addToCart(l.item, l.selectedColour, l.item.available_sizes[0]));
    addToast(`${layers.length} item${layers.length > 1 ? "s" : ""} added to cart`);
  };

  const handleSendToVendor = (
    vendorId: string,
    vendorName: string,
    eventType: EventType,
    notes: string
  ) => {
    const snapshot = exportSnapshot();
    submitRequest(
      vendorId,
      vendorName,
      layers.map((l) => l.itemId),
      eventType,
      notes || undefined,
      snapshot || undefined
    );
    addToast("Styling request sent!");
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Avatar photo */}
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 auto",
          aspectRatio: "2 / 3",
          borderRadius: "var(--shape-lg)",
          overflow: "hidden",
          background: "var(--color-surface-variant)",
          boxShadow: "var(--elevation-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {avatarPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarPhoto}
            alt="Your avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "var(--space-6)" }}>
            <UserRound size={48} strokeWidth={1} style={{ color: "var(--color-outline-variant)", marginBottom: "var(--space-3)" }} />
            <p className="body-small" style={{ color: "var(--color-on-surface-variant)", marginBottom: "var(--space-3)" }}>
              No avatar yet
            </p>
            <Link
              href="/avatar-builder"
              style={{
                color: "var(--color-primary)",
                fontFamily: "var(--type-label-medium-family)",
                fontSize: "var(--type-label-medium-size)",
                fontWeight: "var(--type-label-medium-weight)",
                textDecoration: "none",
              }}
            >
              Build your avatar →
            </Link>
          </div>
        )}
      </div>

      {/* Active layers strip */}
      {layers.length > 0 && (
        <div>
          <p
            className="label-medium"
            style={{
              color: "var(--color-on-surface-variant)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "var(--space-3)",
            }}
          >
            On canvas
          </p>
          <div
            className="scrollbar-hide"
            style={{
              display: "flex",
              gap: "var(--space-4)",
              overflowX: "auto",
              paddingBottom: "var(--space-1)",
            }}
          >
            {layers.map((layer) => (
              <ItemLayerCard
                key={layer.itemId}
                layer={layer}
                isActive={focusedLayer?.itemId === layer.itemId}
                onRemove={(id) => {
                  removeLayer(id);
                  if (focusedItemId === id) setFocusedItemId(null);
                }}
                onClick={() => setFocusedItemId(layer.itemId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Colour switcher for focused layer */}
      {focusedLayer && (
        <ColourSwitcher
          colours={focusedLayer.item.available_colours}
          selected={focusedLayer.selectedColour}
          onSelect={handleColourSwap}
        />
      )}

      {/* Action bar */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-3)",
          alignItems: "center",
          padding: "var(--space-4) 0",
          borderTop: "1px solid var(--color-outline-variant)",
          borderBottom: "1px solid var(--color-outline-variant)",
        }}
      >
        {/* Save Look */}
        <button
          onClick={handleSaveLook}
          aria-label="Save look"
          title="Save look"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--shape-xl)",
            border: "1.5px solid var(--color-outline-variant)",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-on-surface-variant)",
            flexShrink: 0,
          }}
        >
          <BookmarkPlus size={20} strokeWidth={1.5} />
        </button>

        {/* Send to Vendor */}
        <button
          onClick={() => {
            if (layers.length === 0) {
              addToast("Add items to your look first", "info");
              return;
            }
            setShowModal(true);
          }}
          aria-label="Send to vendor"
          title="Send to vendor"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--shape-xl)",
            border: "1.5px solid var(--color-outline-variant)",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-on-surface-variant)",
            flexShrink: 0,
          }}
        >
          <Send size={20} strokeWidth={1.5} />
        </button>

        {/* Add to Cart */}
        <div style={{ flex: 1 }}>
          <Button variant="filled" fullWidth onClick={handleAddAllToBag}>
            <ShoppingBag size={18} strokeWidth={1.5} />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Item picker */}
      <div>
        <p className="title-medium" style={{ marginBottom: "var(--space-4)" }}>
          Add to look
        </p>
        <LayerPanel
          activeItemIds={layers.map((l) => l.itemId)}
          onAdd={(item, colour) => {
            addLayer(item, colour);
            setFocusedItemId(item.id);
          }}
          onRemove={(id) => {
            removeLayer(id);
            if (focusedItemId === id) setFocusedItemId(null);
          }}
        />
      </div>

      {/* Send to vendor modal */}
      {showModal && (
        <SendToVendorModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSendToVendor}
        />
      )}
    </div>
  );
}
