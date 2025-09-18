CORRELATE_SRC="src/correlate.c"
CORRELATE_SCALAR_BUILD="src/correlate-scalar.wasm"
CORRELATE_SIMD_BUILD="src/correlate-simd.wasm"
CORRELATE_SHARED_BUILD="src/correlate-shared.wasm"

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
		-Ofast \
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

correlate-simd:
	@ clang \
		--target=wasm32 \
		-nostdlib \
		-msimd128 \
		-mbulk-memory \
		-DWASM_SIMD \
		-flto \
		-ftree-vectorize \
		-Wl,--import-memory \
		-Wl,--export=correlate \
		-Wl,--export=__heap_base \
		-Wl,--no-entry \
		-Wl,--lto-O3 \
		-Ofast \
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

correlate-shared:
	@ clang \
		--target=wasm32 \
		-nostdlib \
		-msimd128 \
		-matomics \
		-mrelaxed-simd \
		-mextended-const \
		-mnontrapping-fptoint \
		-msign-ext \
		-mmultivalue \
		-mreference-types \
		-mtail-call \
		-mbulk-memory \
		-DWASM_SIMD \
		-flto \
		-ftree-vectorize \
		-Wl,--import-memory \
		-Wl,--shared-memory \
		-Wl,--max-memory=4294967296 \
		-Wl,--export=correlate \
		-Wl,--export=__heap_base \
		-Wl,--no-entry \
		-Wl,--lto-O3 \
		-Ofast \
		-o "$(CORRELATE_SHARED_BUILD)" \
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
		$(CORRELATE_SHARED_BUILD) \
		-o $(CORRELATE_SHARED_BUILD)

embed-wasm: correlate-scalar correlate-simd correlate-shared
	SIMD=$(CORRELATE_SIMD_BUILD) \
	SCALAR=$(CORRELATE_SCALAR_BUILD) \
	SHARED=$(CORRELATE_SHARED_BUILD) \
	SIMD_HEAPBASE=$(shell \
   		wasm-objdump -x $(CORRELATE_SIMD_BUILD) | grep '<__heap_base>' | \
		grep -oE 'i32=[0-9]+' | \
		cut -d= -f2) \
	SCALAR_HEAPBASE=$(shell \
	    wasm-objdump -x $(CORRELATE_SCALAR_BUILD) | grep '<__heap_base>' | \
		grep -oE 'i32=[0-9]+' | \
		cut -d= -f2) \
	SHARED_HEAPBASE=$(shell \
    	wasm-objdump -x $(CORRELATE_SHARED_BUILD) | grep '<__heap_base>' | \
		grep -oE 'i32=[0-9]+' | \
		cut -d= -f2) \
	npm run build
	