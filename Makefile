CORRELATE_SRC="src/correlate.c"
CORRELATE_SCALAR_BUILD="src/correlate-scalar.wasm"
CORRELATE_SIMD_BUILD="src/correlate-simd.wasm"
CORRELATE_SCALAR_HEAPBASE="src/correlate-scalar-heapbase"
CORRELATE_SIMD_HEAPBASE="src/correlate-simd-heapbase"

default: embed-wasm

clean:
	rm -f src/*.wasm

# requires: llvm, clang, llc, binaryen
correlate-scalar:
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
		-o "$(CORRELATE_SCALAR_BUILD)" \
		$(CORRELATE_SRC)
	@ wasm-opt \
		-lmu \
		-O4 \
		--reorder-functions \
		--reorder-locals \
		--coalesce-locals \
		--optimize-instructions \
		--optimize-added-constants-propagate \
		--const-hoisting \
		--simplify-globals \
		--simplify-locals \
		--strip-producers \
		--vacuum \
		--converge \
		$(CORRELATE_SCALAR_BUILD) \
		-o $(CORRELATE_SCALAR_BUILD)

CORRELATE_SCALAR_HEAPBASE:= $(shell \
    wasm-objdump -x $(CORRELATE_SCALAR_BUILD) | grep '<__heap_base>' | \
	grep -oE 'i32=[0-9]+' | \
	cut -d= -f2)

# TODO split out shared memory into a separate wasm
correlate-simd:
	@ clang \
		--target=wasm32 \
		-nostdlib \
		-msimd128 \
		-matomics \
		-mbulk-memory \
		-DWASM_SIMD \
		-flto \
		-Wl,--import-memory \
		-Wl,--shared-memory \
		-Wl,--max-memory=4294967296 \
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
		--coalesce-locals \
		--optimize-instructions \
		--optimize-added-constants-propagate \
		--const-hoisting \
		--simplify-globals \
		--simplify-locals \
		--strip-producers \
		--vacuum \
		--converge \
		$(CORRELATE_SIMD_BUILD) \
		-o $(CORRELATE_SIMD_BUILD)

CORRELATE_SIMD_HEAPBASE:= $(shell \
    wasm-objdump -x $(CORRELATE_SIMD_BUILD) | grep '<__heap_base>' | \
	grep -oE 'i32=[0-9]+' | \
	cut -d= -f2)

embed-wasm: correlate-scalar correlate-simd
	SIMD=$(CORRELATE_SIMD_BUILD) \
	SCALAR=$(CORRELATE_SCALAR_BUILD) \
	SIMD_HEAPBASE=$(CORRELATE_SIMD_HEAPBASE) \
	SCALAR_HEAPBASE=$(CORRELATE_SCALAR_HEAPBASE) \
	npm run build
	