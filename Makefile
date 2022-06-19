CORRELATE_SRC="src/correlate.c"
CORRELATE_BUILD="src/correlate-scalar.wasm"
CORRELATE_SIMD_BUILD="src/correlate-simd.wasm"

default: embed-wasm clean

clean:
	rm -f src/*.wasm

# requires: llvm, clang, llc, binaryen
correlate:
	@ clang \
		--target=wasm32 \
		-nostdlib \
		-flto \
		-Wl,--import-memory \
		-Wl,--export=correlate \
		-Wl,--export=__heap_base \
		-Wl,--no-entry \
		-Wl,--lto-O3 \
		-O3 \
		-o "$(CORRELATE_BUILD)" \
		$(CORRELATE_SRC)
	@ wasm-opt \
		-lmu \
		-O4 \
		--reorder-functions \
		--reorder-locals \
		--strip-producers \
		--vacuum \
		--converge \
		$(CORRELATE_BUILD) \
		-o $(CORRELATE_BUILD)

correlate-simd:
	@ clang \
		--target=wasm32 \
		-nostdlib \
		-msimd128 \
		-DWASM_SIMD \
		-flto \
		-Wl,--import-memory \
		-Wl,--export=correlate \
		-Wl,--export=__heap_base \
		-Wl,--no-entry \
		-Wl,--lto-O3 \
		-O3 \
		-o "$(CORRELATE_SIMD_BUILD)" \
		$(CORRELATE_SRC)
	@ wasm-opt \
		-lmu \
		-O4 \
		--reorder-functions \
		--reorder-locals \
		--strip-producers \
		--vacuum \
		--converge \
		$(CORRELATE_SIMD_BUILD) \
		-o $(CORRELATE_SIMD_BUILD)

embed-wasm: correlate correlate-simd
    SIMD=${CORRELATE_SIMD_BUILD} \
	SCALAR=${CORRELATE_BUILD} \
	npm run embed-wasm