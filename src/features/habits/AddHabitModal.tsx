"use client";
import useAddHabit from "@/hooks/habits/useAddHabit";
import { useTranslations } from "next-intl";
import { CATEGORIES, DAILY, DAYS, FREQUENCIES } from "./constants";

export default function AddHabitModal() {
  const {
    formData,
    setFormData,
    isSelectOpen,
    setIsSelectOpen,
    isModalOpen,
    mutate,
    isPending,
    isError,
    handleClose,
    isSubmitBtnDisabled,
    dropdownRef,
  } = useAddHabit();

  const t = useTranslations("CreateHabit");

  // ключ текущей выбранной частоты
  const frequencyKey = FREQUENCIES.find(
    (f) => f.value === formData.frequency,
  )?.key;

  return (
    <>
      {isModalOpen && (
        <div
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();

              const habitData = {
                name: formData.name,
                description: formData.description,
                icon: formData.icon,
                color: formData.color,
                category: formData.category,
                frequency: formData.frequency,
                ...(formData.days.length > 0 && { days: formData.days }),
              };

              mutate({
                ...habitData,
                // у ежедневной привычки дней нет, даже если их выбирали раньше
                days: habitData.frequency === DAILY ? [] : habitData.days,
              });
            }}
            className="w-full max-w-md mx-4 p-6 rounded-2xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-base font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={() => handleClose()}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  background: "var(--color-surface-muted)",
                  color: "var(--color-text-muted)",
                }}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {/* Название */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {`${t("name")} *`}
                </label>
                <input
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  type="text"
                  value={formData.name}
                  placeholder={`${t("namePlaceholder")}`}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-colors"
                  style={{
                    background: "var(--color-surface-muted)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              {/* Описание */}
              <div className="flex flex-col gap-1">
                <label
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("description")}
                </label>
                <input
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  type="text"
                  value={formData.description}
                  placeholder={`${t("descriptionPlaceholder")}`}
                  className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-colors"
                  style={{
                    background: "var(--color-surface-muted)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              {/* Иконка */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("icon")}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    "🧘",
                    "🏃",
                    "📚",
                    "✍️",
                    "💧",
                    "🥗",
                    "😴",
                    "🏋️",
                    "🎯",
                    "💊",
                  ].map((icon) => (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, icon: icon }))
                      }
                      key={icon}
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-colors"
                      style={{
                        background: formData.icon === icon ? "white" : "",
                        border: "1px solid var(--color-border)",
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Цвет + Категория */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("color")}
                  </label>
                  <div className="flex gap-2 items-center">
                    {[
                      "#8b83e8",
                      "#1D9E75",
                      "#378ADD",
                      "#EF9F27",
                      "#D4537E",
                    ].map((color) => (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color: color }))
                        }
                        key={color}
                        style={{
                          background: color,
                          outline:
                            formData.color === color
                              ? "2px solid var(--color-primary)"
                              : "",
                          outlineOffset: "2px",
                        }}
                        className="w-6 h-6 rounded-full border-2 border-transparent transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("category")}
                  </label>
                  <select
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    value={formData.category}
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none"
                    style={{
                      background: "var(--color-surface-muted)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {t(`categories.${c.key}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Частота */}
              <div className="relative flex flex-col gap-2">
                <label
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {t("frequency")}
                </label>
                {/* Dropdown */}
                <div ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen((prev) => !prev)}
                    className="relative w-full flex px-3 py-2 text-sm rounded-lg outline-none bg-surface-muted border border-border"
                  >
                    {frequencyKey ? t(frequencyKey) : formData.frequency}
                  </button>
                  {isSelectOpen && (
                    <ul className="absolute w-full mt-1 bg-surface border border-border rounded-lg">
                      {FREQUENCIES.map((f) => (
                        <li key={f.value} className="ml-2">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                frequency: f.value,
                              }));
                              setIsSelectOpen(false);
                            }}
                          >
                            {t(f.key)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Дни недели */}
              {formData.frequency !== DAILY && (
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("daysOfWeek")}
                  </label>
                  <div className="flex gap-2">
                    {DAYS.map((day) => {
                      // находим выбранные дни недели
                      const selected = formData.days.includes(day.value);

                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              days: selected
                                ? // записываем/убираем дни недели
                                  prev.days.filter((x) => x !== day.value)
                                : [...prev.days, day.value],
                            }));
                          }}
                          key={day.value}
                          className="w-9 h-9 rounded-full text-xs transition-colors"
                          style={{
                            border: "1px solid var(--color-border)",
                            color: selected
                              ? "white"
                              : "var(--color-text-muted)",
                            background: selected
                              ? "var(--color-primary)"
                              : "transparent",
                          }}
                        >
                          {t(`days.${day.key}`)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {isError && (
                <div className="font-medium text-red-400">
                  {t("createFailed")}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => handleClose()}
                className="flex-1 py-2 text-sm rounded-lg transition-colors"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  background: "transparent",
                }}
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={isSubmitBtnDisabled}
                className="flex-1 py-2 text-sm rounded-lg font-medium transition-colors"
                style={{
                  background: isSubmitBtnDisabled
                    ? "gray"
                    : "var(--color-primary)",
                  color: "#ffffff",
                }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-1 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                  </span>
                ) : (
                  `${t("create")}`
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
