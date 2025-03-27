"use client";

import type { SliderProps as AriaSliderProps } from "react-aria-components";
import { Slider as AriaSlider, Label, SliderOutput, SliderThumb, SliderTrack } from "react-aria-components";
import { cx, sortCx } from "@/components/utils/cx";

const styles = sortCx({
    default: "hidden",
    bottom: "absolute top-2 left-1/2 -translate-x-1/2 translate-y-full text-md leading-md font-medium text-primary",
    "top-floating":
        "absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-lg bg-primary px-3 py-2 text-xs leading-xs font-semibold text-secondary shadow-lg ring-1 ring-border-secondary_alt",
});

interface SliderProps extends AriaSliderProps {
    labelPosition?: keyof typeof styles;
    labelFormatter?: (value: number) => string;
}

export const Slider = ({
    labelPosition = "default",
    minValue = 0,
    maxValue = 100,
    defaultValue = [minValue, maxValue],
    labelFormatter,
    formatOptions,
    ...rest
}: SliderProps) => {
    // Format thumb value as percentage by default.
    const defaultFormatOptions: Intl.NumberFormatOptions = {
        style: "percent",
        maximumFractionDigits: 0,
    };

    return (
        <AriaSlider {...rest} {...{ minValue, maxValue, defaultValue }} formatOptions={formatOptions ?? defaultFormatOptions}>
            <Label />
            <SliderTrack className="relative h-2 w-full rounded-full bg-quaternary">
                {({ state: { values, getThumbValue, getThumbPercent, getFormattedValue, getThumbValueLabel } }) => {
                    const left = getThumbPercent(0);
                    const width = getThumbPercent(1) - left;

                    return (
                        <>
                            <span
                                className="absolute z-10 h-2 w-full rounded-full bg-brand-solid"
                                style={{
                                    left: `${left * 100}%`,
                                    width: `${width * 100}%`,
                                }}
                            />
                            {values.map((_, index) => {
                                return (
                                    <SliderThumb
                                        key={index}
                                        index={index}
                                        className={({ isFocusVisible, isDragging }) =>
                                            cx(
                                                "absolute top-1/2 z-50 box-border size-6 cursor-grab rounded-full bg-slider-handle-bg shadow-md ring-2 ring-slider-handle-border ring-inset",
                                                isFocusVisible && "outline-2 outline-offset-2 outline-focus-ring",
                                                isDragging && "cursor-grabbing",
                                            )
                                        }
                                    >
                                        <SliderOutput className={cx("whitespace-nowrap", styles[labelPosition])}>
                                            {labelFormatter ? labelFormatter(getThumbValue(index)) : getFormattedValue(getThumbValue(index) / 100)}
                                        </SliderOutput>
                                    </SliderThumb>
                                );
                            })}
                        </>
                    );
                }}
            </SliderTrack>
        </AriaSlider>
    );
};
